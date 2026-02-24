/**
 * Shared TypeScript types for the Ink2Screen frontend.
 * Use @medusajs/types for Medusa entity types where possible.
 */

// Re-export Medusa types that we use frequently
export type {
  HttpTypes,
} from "@medusajs/types"

// Custom types for the application

export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

// Future .NET API types (Phase 2)

export interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  ticketPrice: number
  availableTickets: number
  imageUrl?: string
}

export interface SocialFeed {
  platform: "youtube" | "instagram" | "tiktok" | "twitter"
  posts: SocialPost[]
}

export interface SocialPost {
  id: string
  platform: string
  content: string
  url: string
  thumbnailUrl?: string
  createdAt: string
}
