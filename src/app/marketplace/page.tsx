import { Metadata } from "next"
import { sdk, getDefaultRegionId } from "@/lib/sdk"
import { ProductCard } from "@/components/product/product-card"

export const metadata: Metadata = {
  title: "Marketplace",
  description:
    "Browse books and merchandise from Ink2Screen LLC Publishing.",
}

async function getProducts() {
  try {
    const regionId = await getDefaultRegionId()
    const { products, count } = await sdk.store.product.list({
      limit: 20,
      fields: "+variants.calculated_price",
      region_id: regionId,
    })
    return { products, count }
  } catch {
    return { products: [], count: 0 }
  }
}

export default async function MarketplacePage() {
  const { products, count } = await getProducts()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <p className="mt-2 text-muted-foreground">
          Browse our collection of books and merchandise
          {count > 0 && ` (${count} items)`}
        </p>
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-lg text-muted-foreground">
            No products available yet. Check back soon!
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            If you&apos;re running this locally, make sure the Medusa backend is
            running and seeded with data.
          </p>
        </div>
      )}
    </div>
  )
}
