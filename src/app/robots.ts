import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/cart",
          "/checkout/",
          "/api/",
        ],
      },
    ],
    sitemap: "https://www.ink2screenllc.com/sitemap.xml",
    host: "https://www.ink2screenllc.com",
  }
}
