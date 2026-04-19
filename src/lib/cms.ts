type ContentMap = Record<string, Record<string, Record<string, string>>>

const MEDUSA_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const PUB_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

/**
 * Fetch CMS content from Medusa.
 * Uses Next.js Data Cache tagged "cms" — revalidates every 60s automatically,
 * or immediately when the admin saves (via POST /api/revalidate → revalidateTag("cms")).
 */
export async function getContent(page?: string): Promise<ContentMap> {
  const query = page ? `?page=${encodeURIComponent(page)}` : ""

  try {
    const res = await fetch(`${MEDUSA_URL}/store/content${query}`, {
      headers: { "x-publishable-api-key": PUB_KEY },
      next: { revalidate: 60 },
    })

    if (!res.ok) return {}
    const data = (await res.json()) as { content: ContentMap }
    return data.content ?? {}
  } catch {
    return {}
  }
}

/**
 * Get a single CMS value with a fallback default.
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
 * Get all keys in a section as an object with fallbacks.
 *
 * ```ts
 * const hero = cmsSection(content, "home", "hero", { title: "DEFAULT", description: "DEFAULT" })
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
