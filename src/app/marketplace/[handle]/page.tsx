import { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import { sdk, getDefaultRegionId } from "@/lib/sdk"
import { AddToCartButton } from "./add-to-cart-button"
import { ProductReviews } from "./product-reviews"
import { ReviewForm } from "./review-form"

interface Props {
  params: { handle: string }
}

async function getProduct(handle: string) {
  try {
    const regionId = await getDefaultRegionId()
    const { products } = await sdk.store.product.list({
      handle,
      fields: "+variants.calculated_price",
      region_id: regionId,
    })
    return products[0] || null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.handle)
  if (!product) return { title: "Product Not Found" }

  return {
    title: product.title,
    description: product.description || undefined,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProduct(params.handle)

  if (!product) {
    notFound()
  }

  const images = product.images || []
  const thumbnail = product.thumbnail || images[0]?.url

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={product.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No image available
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {/* Categories */}
          {product.categories && product.categories.length > 0 && (
            <div className="mb-2 flex gap-2">
              {product.categories.map((cat) => (
                <span
                  key={cat.id}
                  className="text-sm text-muted-foreground"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          <h1 className="mb-4 text-3xl font-bold">{product.title}</h1>

          {product.description && (
            <p className="mb-6 text-muted-foreground">{product.description}</p>
          )}

          {/* Variants and Add to Cart */}
          <AddToCartButton product={product} />

          {/* Additional Info */}
          <div className="mt-8 space-y-4 border-t pt-8">
            <div>
              <h3 className="mb-2 font-semibold">Shipping</h3>
              <p className="text-sm text-muted-foreground">
                Standard shipping: $5.99 (5-7 business days)
                <br />
                Express shipping: $12.99 (1-3 business days)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 border-t pt-8">
        <ProductReviews productId={product.id} />
        <div className="mt-8">
          <ReviewForm productId={product.id} />
        </div>
      </div>
    </div>
  )
}
