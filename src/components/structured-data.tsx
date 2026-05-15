import type { JsonLd } from "@/lib/seo"

/**
 * Renders one or more JSON-LD blocks as <script type="application/ld+json">.
 *
 * Server component — the schema ships in the initial HTML so Googlebot
 * sees it without executing JavaScript. Pass a single object or an array;
 * arrays are emitted as one script per entity for maximum parser tolerance.
 */
export function StructuredData({ data }: { data: JsonLd | JsonLd[] }) {
  const blocks = Array.isArray(data) ? data : [data]
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Schema is built server-side from trusted constants/CMS data.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  )
}
