import Medusa from "@medusajs/js-sdk"

let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

let cachedRegionId: string | null = null

export async function getDefaultRegionId(): Promise<string | undefined> {
  if (cachedRegionId) return cachedRegionId

  try {
    const { regions } = await sdk.store.region.list({ limit: 1 })
    if (regions.length > 0) {
      cachedRegionId = regions[0].id
      return cachedRegionId
    }
  } catch {
    // Region fetch failed
  }
  return undefined
}
