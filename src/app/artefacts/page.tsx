import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "The Artifacts",
  description:
    "Limited editions, narratives, and curated goods from Ink2Screen LLC Publishing.",
}

const products = [
  {
    title: "Raison D\u2019etre",
    subtitle: "HARDCOVER",
    price: "$24.99",
    image: "/images/book-cover-front.png",
    href: "/artefacts/raison-detre",
  },
  {
    title: "Raison D\u2019etre Cap",
    subtitle: "Cotton",
    price: "$24.99",
    image: "/images/product-hat.png",
    href: "/marketplace",
  },
  {
    title: "Raison D\u2019etre Tank",
    subtitle: "Cotton",
    price: "$24.99",
    image: "/images/product-tank.png",
    href: "/marketplace",
  },
]

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
function ProductCard({
  title,
  subtitle,
  price,
  image,
  href,
}: {
  title: string
  subtitle: string
  price: string
  image: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="group relative flex h-[560px] w-full flex-col items-center justify-center overflow-hidden bg-[#121212] transition-transform hover:scale-[1.02] md:w-[410px]"
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
      <div className="absolute left-1/2 top-[40%] h-[193px] w-[194px] -translate-x-1/2 -translate-y-1/2">
        <Image
          src="/images/purple-glow.png"
          alt=""
          width={500}
          height={500}
          className="h-full w-full scale-[2.5] object-contain opacity-60"
        />
      </div>

      {/* Product image */}
      <div className="relative flex h-[355px] items-center justify-center p-6">
        <Image
          src={image}
          alt={title}
          width={290}
          height={307}
          className="h-auto max-h-[307px] w-auto max-w-[290px] object-contain"
        />
      </div>

      {/* Product info */}
      <div className="relative flex flex-col items-center gap-2 text-center">
        <h2 className="font-heading text-[32px] font-bold leading-[1.4] tracking-tight text-[#e0e0e0]">
          {title}
        </h2>
        <p className="text-[11px] font-bold tracking-[0.05em] text-[#888]">
          {subtitle}
        </p>
      </div>

      <p className="relative mt-4 text-base font-normal leading-[1.7] text-brand-gold">
        {price}
      </p>
    </Link>
  )
}

/* ─── Product Grid ─── */
function ProductGridSection() {
  return (
    <section className="bg-[#050505] px-6 py-0">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-6 md:flex-row md:justify-center">
        {products.map((product) => (
          <ProductCard key={product.title} {...product} />
        ))}
      </div>
    </section>
  )
}

/* ─── Artefacts Page ─── */
export default function ArtefactsPage() {
  return (
    <div className="bg-[#050505]">
      <HeroSection />
      <ProductGridSection />
      {/* Spacer before footer */}
      <div className="h-24" />
    </div>
  )
}
