import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { sdk, getDefaultRegionId } from "@/lib/sdk"

export const metadata: Metadata = {
  title: "The Artifacts",
  description:
    "Limited editions, narratives, and curated goods from Ink2Screen LLC Publishing.",
}

function formatPrice(amount: number | undefined | null, currency: string = "usd") {
  if (amount == null) return ""
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}

async function getProducts() {
  try {
    const regionId = await getDefaultRegionId()
    const { products } = await sdk.store.product.list({
      limit: 20,
      fields: "+variants.calculated_price",
      region_id: regionId,
    })
    return products
  } catch {
    return []
  }
}

/* ─── Hero ─── */
function HeroSection() {
  return (
    <section className="relative flex h-[400px] items-center justify-center overflow-hidden">
      {/* Texture overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg-texture.jpg"
          alt=""
          fill
          className="object-cover opacity-10 mix-blend-soft-light"
          priority
        />
      </div>

      <div className="relative mx-auto flex max-w-[1088px] flex-col items-center gap-8 px-6 text-center">
        <h1 className="font-heading text-5xl font-bold leading-[1.2] tracking-tight text-[#e0e0e0] md:text-[64px]">
          THE COLLECTION
        </h1>
        <p className="max-w-[800px] text-xl font-light leading-relaxed text-brand-gold md:text-2xl md:leading-[1.6]">
          Limited editions, narratives, and curated goods.
        </p>
      </div>
    </section>
  )
}

/* ─── Product Card ─── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProductCard({ product }: { product: any }) {
  const firstVariant = product.variants?.[0]
  const price = firstVariant?.calculated_price?.calculated_amount
  const currency = firstVariant?.calculated_price?.currency_code || "usd"
  const category = product.categories?.[0]?.name

  return (
    <Link
      href={`/artefacts/${product.handle}`}
      className="group relative flex h-[560px] w-full flex-col overflow-hidden bg-[#121212] transition-transform hover:scale-[1.02]"
    >
      {/* Background texture */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg-texture.jpg"
          alt=""
          fill
          className="object-cover opacity-10 mix-blend-multiply"
        />
      </div>

      {/* Purple glow behind product */}
      <div className="absolute left-1/2 top-[35%] h-[193px] w-[194px] -translate-x-1/2 -translate-y-1/2">
        <Image
          src="/images/purple-glow.png"
          alt=""
          width={500}
          height={500}
          className="h-full w-full scale-[2.5] object-contain opacity-60"
        />
      </div>

      {/* Product image — fixed height, uniform display */}
      <div className="relative flex flex-1 items-center justify-center p-6">
        {product.thumbnail ? (
          <div className="relative h-[260px] w-[240px]">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-contain"
              sizes="240px"
            />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-[#888]">
            No image
          </div>
        )}
      </div>

      {/* Product info — pinned to bottom with fixed height */}
      <div className="relative flex h-[160px] flex-col items-center justify-center gap-2 px-4 text-center">
        <h2 className="line-clamp-2 max-w-full font-heading text-xl font-bold leading-[1.3] tracking-tight text-[#e0e0e0] md:text-2xl">
          {product.title}
        </h2>
        <p className="text-[11px] font-bold tracking-[0.05em] text-[#888]">
          {category || firstVariant?.title || ""}
        </p>
        <p className="mt-1 text-base font-normal leading-[1.7] text-brand-gold">
          {formatPrice(price, currency)}
        </p>
      </div>
    </Link>
  )
}

/* ─── Product Grid ─── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProductGridSection({ products }: { products: any[] }) {
  if (products.length === 0) {
    return (
      <section className="bg-[#050505] px-6 py-16">
        <div className="mx-auto max-w-[1280px] text-center">
          <p className="text-lg text-[#888]">
            No products available yet. Check back soon!
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-[#050505] px-6 py-0">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

/* ─── Artefacts Page ─── */
export default async function ArtefactsPage() {
  const products = await getProducts()

  return (
    <div className="bg-[#050505]">
      <HeroSection />
      <ProductGridSection products={products} />
      {/* Spacer before footer */}
      <div className="h-24" />
    </div>
  )
}
