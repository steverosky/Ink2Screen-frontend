import type { MetadataRoute } from "next"
import { sdk, getDefaultRegionId } from "@/lib/sdk"
import { getUpcomingEvents } from "@/lib/events-api"

const SITE_URL = "https://www.ink2screenllc.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString()

  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/artefacts`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/events`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/social`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ]

  // Dynamic product pages
  let productRoutes: MetadataRoute.Sitemap = []
  try {
    const regionId = await getDefaultRegionId()
    const { products } = await sdk.store.product.list({
      limit: 100,
      fields: "handle,updated_at",
      region_id: regionId,
    })
    productRoutes = products
      .filter((p) => p.handle)
      .map((p) => ({
        url: `${SITE_URL}/artefacts/${p.handle}`,
        lastModified: p.updated_at ?? now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
  } catch {
    // If Medusa is unreachable at build time, skip product routes
  }

  // Dynamic event pages
  let eventRoutes: MetadataRoute.Sitemap = []
  try {
    const events = await getUpcomingEvents()
    eventRoutes = events.map((e) => ({
      url: `${SITE_URL}/events/${e.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  } catch {
    // If events API is unreachable at build time, skip event routes
  }

  return [...staticRoutes, ...productRoutes, ...eventRoutes]
}
