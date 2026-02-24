import { create } from "zustand"
import { persist } from "zustand/middleware"

/**
 * Cart Store
 * Manages cart ID persistence. Actual cart data comes from Medusa API.
 */
interface CartState {
  cartId: string | null
  setCartId: (id: string) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartId: null,
      setCartId: (id: string) => set({ cartId: id }),
      clearCart: () => set({ cartId: null }),
    }),
    {
      name: "ink2screen-cart",
    }
  )
)

/**
 * Region Store
 * Tracks the selected region for pricing.
 */
interface RegionState {
  regionId: string | null
  countryCode: string
  setRegion: (regionId: string, countryCode: string) => void
}

export const useRegionStore = create<RegionState>()(
  persist(
    (set) => ({
      regionId: null,
      countryCode: "us",
      setRegion: (regionId: string, countryCode: string) =>
        set({ regionId, countryCode }),
    }),
    {
      name: "ink2screen-region",
    }
  )
)

/**
 * Auth Store (Optional)
 * Tracks customer authentication state for convenience features.
 * Guest checkout works without authentication.
 * The Medusa SDK handles JWT token storage internally.
 */
interface AuthState {
  customer: {
    id: string
    email: string
    first_name: string | null
    last_name: string | null
  } | null
  isAuthenticated: boolean
  setCustomer: (customer: AuthState["customer"]) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      customer: null,
      isAuthenticated: false,
      setCustomer: (customer) =>
        set({ customer, isAuthenticated: !!customer }),
      clearAuth: () => set({ customer: null, isAuthenticated: false }),
    }),
    {
      name: "ink2screen-auth",
    }
  )
)
