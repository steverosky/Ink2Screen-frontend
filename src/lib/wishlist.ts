import { sdk } from "@/lib/sdk"

export type WishlistItem = {
  id: string
  product_id: string
  variant_id: string | null
}

export type Wishlist = {
  id: string
  customer_id: string
  items: WishlistItem[]
}

type WishlistResponse = {
  wishlist: Wishlist | null
}

type WishlistItemResponse = {
  item: WishlistItem
}

export async function getWishlist(): Promise<Wishlist | null> {
  try {
    const data = await sdk.client.fetch<WishlistResponse>(
      "/store/customers/me/wishlists"
    )
    return data.wishlist
  } catch {
    return null
  }
}

export async function addToWishlist(
  productId: string,
  variantId?: string
): Promise<WishlistItem | null> {
  try {
    const data = await sdk.client.fetch<WishlistItemResponse>(
      "/store/customers/me/wishlists/items",
      {
        method: "POST",
        body: {
          product_id: productId,
          variant_id: variantId,
        },
      }
    )
    return data.item
  } catch {
    return null
  }
}

export async function removeFromWishlist(itemId: string): Promise<boolean> {
  try {
    await sdk.client.fetch(`/store/customers/me/wishlists/items/${itemId}`, {
      method: "DELETE",
    })
    return true
  } catch {
    return false
  }
}
