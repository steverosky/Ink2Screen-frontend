import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { sdk, getDefaultRegionId } from "@/lib/sdk"
import { Separator } from "@/components/ui/separator"
import { ProductReviews } from "./product-reviews"
import { ReviewForm } from "./review-form"
import { ProductDetailClient } from "./product-detail-client"

interface Props {
  params: Promise<{ handle: string }>
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

async function getRecommendedProducts(excludeId: string) {
  try {
    const regionId = await getDefaultRegionId()
    const { products } = await sdk.store.product.list({
      limit: 4,
      fields: "+variants.calculated_price",
      region_id: regionId,
    })
    return products.filter((p) => p.id !== excludeId).slice(0, 2)
  } catch {
    return []
  }
}

function formatPrice(amount: number | undefined | null, currency: string = "usd") {
  if (amount == null) return ""
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const product = await getProduct(handle)
  if (!product) return { title: "Product Not Found" }

  return {
    title: product.title,
    description: product.description || undefined,
  }
}

/* ─── Product Images (left, scrollable) ─── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProductImages({ product }: { product: any }) {
  const images = product.images || []
  const thumbnail = product.thumbnail || images[0]?.url
  const allImages = thumbnail
    ? [{ url: thumbnail, id: "thumb" }, ...images.filter((img: { url: string }) => img.url !== thumbnail)]
    : images

  if (allImages.length === 0) {
    return (
      <div className="flex w-full lg:w-[810px] lg:pl-20">
        <div className="flex h-[500px] w-full items-center justify-center bg-[#121212] text-[#888] lg:h-[720px]">
          No images available
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col lg:w-[810px] lg:pl-20">
      {allImages.map((img: { url: string; id: string }, i: number) => (
        <div
          key={img.id || i}
          className={`relative flex h-[500px] items-center justify-center overflow-hidden lg:h-[720px] ${
            i === 0 ? "bg-[#121212]" : "bg-gradient-to-br from-brand-gold/20 to-[#aa8324]/20"
          }`}
        >
          {/* Purple glow for first image */}
          {i === 0 && (
            <div className="absolute inset-0">
              <Image
                src="/images/purple-glow-portrait.png"
                alt=""
                fill
                className="object-contain opacity-50"
              />
            </div>
          )}
          {/* Texture overlay for subsequent images */}
          {i > 0 && (
            <div className="absolute inset-0">
              <Image
                src="/images/hero-bg-texture.jpg"
                alt=""
                fill
                className="object-cover opacity-10 mix-blend-multiply"
              />
            </div>
          )}
          <div className="relative h-[80%] w-[80%]">
            <Image
              src={img.url}
              alt={product.title}
              fill
              className="object-contain"
              priority={i === 0}
              sizes="(max-width: 1024px) 100vw, 810px"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Recommended Product Card ─── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RecommendedCard({ product }: { product: any }) {
  const firstVariant = product.variants?.[0]
  const price = firstVariant?.calculated_price?.calculated_amount
  const currency = firstVariant?.calculated_price?.currency_code || "usd"
  const category = product.categories?.[0]?.name

  return (
    <Link
      href={`/artefacts/${product.handle}`}
      className="group relative flex h-[560px] w-full flex-col items-center justify-center overflow-hidden bg-[#121212] transition-transform hover:scale-[1.02] md:w-[410px]"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg-texture.jpg"
          alt=""
          fill
          className="object-cover opacity-10 mix-blend-multiply"
        />
      </div>
      <div className="absolute left-1/2 top-[40%] h-[193px] w-[194px] -translate-x-1/2 -translate-y-1/2">
        <Image
          src="/images/purple-glow.png"
          alt=""
          width={500}
          height={500}
          className="h-full w-full scale-[2.5] object-contain opacity-60"
        />
      </div>
      <div className="relative flex h-[355px] items-center justify-center p-6">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            width={290}
            height={290}
            className="h-auto max-h-[290px] w-auto max-w-[290px] object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#888]">
            No image
          </div>
        )}
      </div>
      <div className="relative flex flex-col items-center gap-2 text-center">
        <h3 className="font-heading text-[32px] font-bold leading-[1.4] tracking-tight text-[#e0e0e0]">
          {product.title}
        </h3>
        <p className="text-[11px] font-bold tracking-[0.05em] text-[#888]">
          {category || firstVariant?.title || ""}
        </p>
      </div>
      <p className="relative mt-4 text-base font-normal leading-[1.7] text-brand-gold">
        {formatPrice(price, currency)}
      </p>
    </Link>
  )
}

/* ─── Recommended Products Section ─── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RecommendedSection({ products }: { products: any[] }) {
  if (products.length === 0) return null

  return (
    <section className="relative overflow-hidden bg-[#050505] px-6 py-20">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg-texture.jpg"
          alt=""
          fill
          className="object-cover opacity-5 mix-blend-soft-light"
        />
      </div>
      <div className="relative mx-auto flex max-w-[1280px] flex-col items-center gap-16">
        <p className="text-center text-sm font-semibold tracking-[0.1em] text-brand-gold">
          MORE RECOMMENDED PRODUCTS
        </p>
        <div className="flex flex-col gap-6 md:flex-row md:justify-center">
          {products.map((product) => (
            <RecommendedCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Testimonial Section ─── */
function TestimonialSection() {
  return (
    <section className="relative h-[760px] overflow-hidden bg-gradient-to-br from-brand-gold/20 to-[#aa8324]/20">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg-texture.jpg"
          alt=""
          fill
          className="object-cover opacity-5 mix-blend-soft-light"
        />
      </div>
      <div className="relative mx-auto flex h-full max-w-[1240px] items-center px-6">
        <div className="flex w-full flex-col overflow-hidden md:flex-row">
          <div className="relative h-[400px] w-full overflow-hidden md:h-auto md:w-[466px]">
            <Image
              src="/images/library-bg.jpg"
              alt="Testimonial"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col gap-6 bg-[#28292a] p-6">
            <Image
              src="/images/icon-quote.png"
              alt=""
              width={100}
              height={100}
            />
            <p className="text-xl font-light leading-relaxed text-[#f0f0f0] md:text-2xl md:leading-[1.6]">
              &ldquo;Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
              pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
              culpa qui officia deserunt mollit anim id est laborum.&rdquo;
            </p>
            <p className="text-right text-xl font-medium leading-relaxed text-[#f0f0f0] md:text-2xl">
              John A. Doe
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Product Detail Page ─── */
export default async function ProductDetailPage({ params }: Props) {
  const { handle } = await params
  const product = await getProduct(handle)

  if (!product) {
    notFound()
  }

  const recommended = await getRecommendedProducts(product.id)

  return (
    <div className="bg-[#050505]">
      {/* Main product area with texture bg */}
      <section className="relative overflow-hidden bg-[#121212]">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bg-texture.jpg"
            alt=""
            fill
            className="object-cover opacity-5 mix-blend-multiply"
          />
        </div>
        <div className="relative mx-auto flex max-w-[1440px] flex-col lg:flex-row">
          <ProductImages product={product} />
          <ProductDetailClient product={product} />
        </div>
      </section>

      {/* Reviews Section */}
      <section className="mx-auto max-w-[1280px] px-6">
        <Separator className="bg-[#333]" />
        <ProductReviews productId={product.id} />
        <div className="mt-8 pb-12">
          <ReviewForm productId={product.id} />
        </div>
      </section>

      <RecommendedSection products={recommended} />
      <TestimonialSection />
    </div>
  )
}
