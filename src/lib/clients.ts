/**
 * API Client Abstraction Layer
 *
 * This module provides unified access to both backends:
 * - Medusa.js (e-commerce) via the official JS SDK
 * - ASP.NET Core (custom features) via fetch (Phase 2)
 *
 * IMPORTANT: Always use the Medusa SDK for Medusa API calls.
 * Never use raw fetch() for Medusa routes - the SDK handles
 * required headers (publishable API key, auth tokens) automatically.
 */

export { sdk } from "./sdk"

// Future .NET API client (Phase 2)
const DOTNET_API_URL = process.env.NEXT_PUBLIC_DOTNET_API_URL || "http://localhost:5000"

/**
 * .NET API client for custom features (events, memberships, etc.)
 * Will share JWT token from Medusa auth for cross-service authentication.
 */
export async function dotnetFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== "undefined"
    ? localStorage.getItem("medusa_auth_token")
    : null

  const response = await fetch(`${DOTNET_API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}
