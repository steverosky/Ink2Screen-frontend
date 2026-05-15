/**
 * Centralized SEO + structured-data (JSON-LD) builders.
 *
 * Every schema function returns a plain object that is rendered via the
 * <StructuredData /> component. Keep IDs stable — Google uses the `@id`
 * values to stitch the Organization / Person / WebSite entities together
 * into a single knowledge graph for the brand.
 */

export const SITE_URL = "https://www.ink2screenllc.com"
export const SITE_NAME = "Ink2Screen LLC Publishing"
export const SITE_TAGLINE = "Every Story Has a Purpose"
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/book-spotlight.png`
export const ORG_LOGO = `${SITE_URL}/images/logo.png`

/** Stable @id anchors so entities cross-reference instead of duplicating. */
export const ORG_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`
export const FOUNDER_ID = `${SITE_URL}/#founder`

/** Brand social profiles — feeds sameAs for entity disambiguation. */
const BRAND_SAME_AS = [
  "https://instagram.com/ink2screen",
  "https://tiktok.com/@ink2screen",
  "https://youtube.com/@Ink2ScreenLLC",
  "https://x.com/Ink2ScreenLLC",
]

/** Founder/author profiles — separate Person entity for E-E-A-T. */
const FOUNDER_SAME_AS = ["https://youtube.com/@GalvarinoChillyTv"]

export type JsonLd = Record<string, unknown>

/**
 * The author/founder as a first-class Person entity. Critical for E-E-A-T:
 * Google ties authored books and "about the author" content to this node.
 */
export function personSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: "Sterling R. Smith",
    alternateName: "Sterling Smith",
    jobTitle: "Author, Engineer & Founder",
    description:
      "Engineer and author. Founder of Ink2Screen LLC Publishing, where he develops literary works engineered for readers and screen adaptation.",
    url: `${SITE_URL}/about#author`,
    image: `${SITE_URL}/images/sterling-portrait.jpg`,
    sameAs: FOUNDER_SAME_AS,
    worksFor: { "@id": ORG_ID },
  }
}

/**
 * The publishing company as an Organization. Powers the brand knowledge
 * panel and branded-search enhancements.
 */
export function organizationSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "Publisher"],
    "@id": ORG_ID,
    name: SITE_NAME,
    legalName: "Ink2Screen LLC",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: ORG_LOGO,
      width: 512,
      height: 512,
    },
    image: DEFAULT_OG_IMAGE,
    description:
      "Ink2Screen LLC Publishing develops engineering narratives for readers and screen adaptation — books, events, and exclusive merchandise by Sterling R. Smith.",
    slogan: SITE_TAGLINE,
    founder: { "@id": FOUNDER_ID },
    foundingLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Houston",
        addressRegion: "TX",
        addressCountry: "US",
      },
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Houston",
      addressRegion: "TX",
      addressCountry: "US",
    },
    email: "info@ink2screenllc.com",
    sameAs: BRAND_SAME_AS,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "info@ink2screenllc.com",
      areaServed: "US",
      availableLanguage: "English",
    },
  }
}

/**
 * The website entity. `publisher` links it to the Organization node.
 * No SearchAction: the site has no crawlable search-results URL, and
 * declaring a non-functional one violates Google's sitelinks-searchbox
 * guidelines.
 */
export function websiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    description: `${SITE_NAME} — ${SITE_TAGLINE}`,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
  }
}

export interface BreadcrumbItem {
  name: string
  /** Path relative to site root, e.g. "/artefacts". Omit for the current page. */
  path?: string
}

/** BreadcrumbList — drives the SERP breadcrumb trail and site-structure signals. */
export function breadcrumbSchema(items: BreadcrumbItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.path ? { item: `${SITE_URL}${item.path}` } : {}),
    })),
  }
}

export interface ProductSchemaInput {
  handle: string
  title: string
  description?: string | null
  image: string
  price?: number | null
  currency?: string
  sku?: string | null
  /** Treat as a Book (richer SERP) when the product is the novel. */
  isBook?: boolean
  inStock?: boolean
  aggregateRating?: { ratingValue: number; reviewCount: number } | null
}

/**
 * Product (or Book) schema with offer + optional aggregateRating.
 * aggregateRating is what unlocks star snippets in Google results —
 * a major CTR lever — so it is wired from real review data when present.
 */
export function productSchema(p: ProductSchemaInput): JsonLd {
  const url = `${SITE_URL}/artefacts/${p.handle}`
  const currency = (p.currency || "USD").toUpperCase()

  // Price stays valid through the end of next year (Google warns when absent).
  const priceValidUntil = `${new Date().getFullYear() + 1}-12-31`

  const schema: JsonLd = {
    "@context": "https://schema.org",
    "@type": p.isBook ? "Book" : "Product",
    name: p.title,
    description: p.description || `${p.title} from ${SITE_NAME}.`,
    image: p.image,
    url,
    sku: p.sku || p.handle,
    brand: { "@type": "Brand", name: SITE_NAME },
  }

  if (p.isBook) {
    schema.author = { "@id": FOUNDER_ID }
    schema.publisher = { "@id": ORG_ID }
    schema.bookFormat = "https://schema.org/Hardcover"
    schema.inLanguage = "en"
  }

  if (p.price != null) {
    schema.offers = {
      "@type": "Offer",
      url,
      price: p.price.toFixed(2),
      priceCurrency: currency,
      priceValidUntil,
      itemCondition: "https://schema.org/NewCondition",
      availability: p.inStock === false
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      seller: { "@id": ORG_ID },
    }
  }

  if (p.aggregateRating && p.aggregateRating.reviewCount > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: p.aggregateRating.ratingValue,
      reviewCount: p.aggregateRating.reviewCount,
      bestRating: 5,
      worstRating: 1,
    }
  }

  return schema
}

export interface EventSchemaInput {
  id: string
  title: string
  description: string
  startDate: string
  endDate?: string | null
  venue?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  image?: string | null
  price?: number | null
  isFree?: boolean
  isSoldOut?: boolean
  isCancelled?: boolean
}

/**
 * Event schema — unlocks Google's event rich results (date, location, and
 * ticket info shown directly in search), high value for local discovery.
 */
export function eventSchema(e: EventSchemaInput): JsonLd {
  const url = `${SITE_URL}/events/${e.id}`
  const schema: JsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    description: e.description.replace(/\n+/g, " ").trim().slice(0, 500),
    startDate: e.startDate,
    ...(e.endDate ? { endDate: e.endDate } : {}),
    eventStatus: e.isCancelled
      ? "https://schema.org/EventCancelled"
      : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: e.image || DEFAULT_OG_IMAGE,
    url,
    location: {
      "@type": "Place",
      name: e.venue || "Venue announced upon registration",
      address: {
        "@type": "PostalAddress",
        ...(e.address ? { streetAddress: e.address } : {}),
        addressLocality: e.city || "Houston",
        addressRegion: e.state || "TX",
        addressCountry: "US",
      },
    },
    organizer: { "@id": ORG_ID },
    performer: { "@id": FOUNDER_ID },
    offers: {
      "@type": "Offer",
      url,
      price: e.isFree ? "0" : (e.price ?? 0).toFixed(2),
      priceCurrency: "USD",
      availability: e.isSoldOut
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
      validFrom: new Date().toISOString(),
    },
  }
  return schema
}
