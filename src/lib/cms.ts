import { sdk } from "./sdk"

// Structured content: { page: { section: { key: value } } }
type ContentMap = Record<string, Record<string, Record<string, string>>>

let contentCache: ContentMap | null = null
let cacheTimestamp = 0
const CACHE_TTL = 30_000 // 30 seconds

/**
 * Fetch all CMS content from the Medusa store API.
 * Results are cached in memory for CACHE_TTL ms.
 */
export async function getContent(
  page?: string
): Promise<ContentMap> {
  const now = Date.now()

  if (contentCache && now - cacheTimestamp < CACHE_TTL) {
    if (page && contentCache[page]) {
      return { [page]: contentCache[page] }
    }
    return contentCache
  }

  try {
    const query = page ? `?page=${encodeURIComponent(page)}` : ""
    const result = await sdk.client.fetch<{
      content: ContentMap
    }>(`/store/content${query}`, { method: "GET" })

    if (!page) {
      // Full fetch — cache everything
      contentCache = result.content
      cacheTimestamp = now
    }

    return result.content
  } catch {
    // If CMS is unavailable, return empty — fallback defaults will be used
    return {}
  }
}

/**
 * Get a single CMS value with a fallback default.
 * Use this in page components:
 *
 * ```ts
 * const content = await getContent("home")
 * const title = cms(content, "home", "hero", "title", "DEFAULT TITLE")
 * ```
 */
export function cms(
  content: ContentMap,
  page: string,
  section: string,
  key: string,
  fallback: string
): string {
  return content?.[page]?.[section]?.[key] ?? fallback
}

/**
 * Helper to get all keys in a section as an object with fallbacks.
 *
 * ```ts
 * const hero = cmsSection(content, "home", "hero", {
 *   title: "DEFAULT TITLE",
 *   description: "DEFAULT DESC",
 * })
 * // hero.title, hero.description — uses CMS values or defaults
 * ```
 */
export function cmsSection<T extends Record<string, string>>(
  content: ContentMap,
  page: string,
  section: string,
  defaults: T
): T {
  const sectionData = content?.[page]?.[section] || {}
  const result = { ...defaults }
  for (const key of Object.keys(defaults)) {
    if (sectionData[key] !== undefined) {
      ;(result as Record<string, string>)[key] = sectionData[key]
    }
  }
  return result
}

/**
 * Invalidate the in-memory cache.
 * Useful after admin updates content and user refreshes.
 */
export function invalidateContentCache() {
  contentCache = null
  cacheTimestamp = 0
}
