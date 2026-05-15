import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Private / no-SEO-value paths. Login & register are intentionally
        // left crawlable so Google can see their noindex meta tag.
        disallow: [
          "/dashboard/",
          "/cart",
          "/checkout/",
          "/newsletter/",
          "/api/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
