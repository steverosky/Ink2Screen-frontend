"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { ChevronRight, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const formats = ["HARDCOVER", "DIGITAL", "AUDIO"]
const quantities = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const productImages = [
  {
    src: "/images/product-book-hero.jpg",
    alt: "Raison D'etre book covers",
    hasPurpleGlow: true,
  },
  {
    src: "/images/product-book-standing.jpg",
    alt: "Raison D'etre standing book",
    hasGoldGradient: true,
  },
]

const bookDetails = [
  { label: "ASIN", value: "B0DWG2C8RY" },
  { label: "Publisher", value: "Ink2ScreenLLC" },
  { label: "Publication date", value: "February 5, 2025" },
  { label: "Language", value: "English" },
  { label: "Print length", value: "268 pages" },
  { label: "ISBN-13", value: "979-8992417616" },
  { label: "Item Weight", value: "13.1 ounces" },
  { label: "Dimensions", value: "6 x 0.67 x 9 inches" },
]

const recommendedProducts = [
  {
    title: "Raison D\u2019etre Cap",
    subtitle: "Cotton",
    price: "$24.99",
    image: "/images/product-hat.png",
    href: "/artefacts",
  },
  {
    title: "Raison D\u2019etre Tank",
    subtitle: "Cotton",
    price: "$24.99",
    image: "/images/product-tank.png",
    href: "/artefacts",
  },
]

/* ─── Product Images (left, scrollable) ─── */
function ProductImages() {
  return (
    <div className="flex w-full flex-col lg:w-[810px] lg:pl-20">
      {productImages.map((img, i) => (
        <div
          key={i}
          className={cn(
            "relative flex h-[500px] items-center justify-center overflow-hidden lg:h-[720px]",
            img.hasPurpleGlow && "bg-[#121212]",
            img.hasGoldGradient &&
              "bg-gradient-to-br from-brand-gold/20 to-[#aa8324]/20"
          )}
        >
          {/* Purple glow for first image */}
          {img.hasPurpleGlow && (
            <div className="absolute inset-0">
              <Image
                src="/images/purple-glow-portrait.png"
                alt=""
                fill
                className="object-contain opacity-50"
              />
            </div>
          )}
          {/* Texture overlay for second image */}
          {img.hasGoldGradient && (
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
              src={img.src}
              alt={img.alt}
              fill
              className="object-contain"
              priority={i === 0}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Product Details (right, sticky) ─── */
function ProductDetails() {
  const [selectedFormat, setSelectedFormat] = useState("HARDCOVER")
  const [selectedQty, setSelectedQty] = useState(1)
  const [detailsOpen, setDetailsOpen] = useState(true)
  const [shippingOpen, setShippingOpen] = useState(false)

  return (
    <div className="w-full px-6 pt-10 lg:sticky lg:top-20 lg:h-fit lg:w-[630px] lg:self-start lg:px-20 lg:pt-20">
      <div className="flex flex-col gap-6">
        {/* Title */}
        <h1 className="font-heading text-4xl font-bold leading-[1.3] tracking-tight text-[#e0e0e0] md:text-5xl">
          RAISON D&apos;ETRE
        </h1>

        {/* Eyebrow */}
        <p className="text-sm font-semibold tracking-[0.1em] text-brand-gold">
          DEBUT NOVEL &bull; FIRST EDITION
        </p>

        {/* Pricing */}
        <div className="flex flex-wrap items-center gap-4 lg:gap-6">
          <p className="text-[32px] font-bold leading-[1.4] tracking-tight text-[#e0e0e0]">
            $24.99
          </p>
          <span className="text-2xl font-light text-[#f0f0f0]">|</span>
          <p className="text-2xl font-medium text-[#888] line-through">
            $20.99
          </p>
          <div className="text-sm font-medium leading-relaxed text-[#e0e0e0]">
            <p>Registered fans save 10%</p>
            <Link
              href="/events"
              className="text-brand-gold underline decoration-brand-gold"
            >
              Join us &rarr;
            </Link>
          </div>
        </div>

        <Separator className="bg-[#333]" />

        {/* Description */}
        <div className="text-base font-normal leading-[1.7] text-[#e0e0e0]">
          <p>
            Meet Quincy, a young, rising professional born and raised in New
            York. He&apos;s excelling at his job, his relationship with his
            girlfriend Bria is progressing nicely, and &quot;Mystery,&quot; his
            sexy side piece, keeps him satisfied. Quincy enjoys taking risks that
            land him in sketchy places, but he&apos;s managed to stay out of
            trouble for the most part- until he finds himself in the wrong place
            at the wrong time with the wrong woman on his arm. As a result,
            Quincy&apos;s life begins spiraling out of control, and he has no
            idea who is coming after him or why he&apos;s the target. As he runs
            from this invisible foe, Quincy learns how fragile his own life is,
            and how desperate he is to protect the people he loves.
          </p>
          <p className="mt-4 cursor-pointer text-brand-gold transition-colors hover:text-brand-gold-light">
            View more...
          </p>
        </div>

        <Separator className="bg-[#333]" />

        {/* Select Format */}
        <p className="text-sm font-semibold tracking-[0.1em] text-brand-gold">
          SELECT FORMAT
        </p>
        <div className="flex flex-wrap gap-4 lg:gap-6">
          {formats.map((format) => (
            <button
              key={format}
              onClick={() => setSelectedFormat(format)}
              className={cn(
                "flex h-14 items-center justify-center border px-8 text-sm font-bold tracking-widest transition-colors",
                selectedFormat === format
                  ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                  : "border-brand-gold/50 text-brand-gold/70 hover:border-brand-gold hover:text-brand-gold"
              )}
            >
              {format}
            </button>
          ))}
        </div>

        {/* Quantity */}
        <p className="text-sm font-semibold tracking-[0.1em] text-brand-gold">
          Quantity:
        </p>
        <div className="flex flex-wrap gap-2">
          {quantities.map((qty) => (
            <button
              key={qty}
              onClick={() => setSelectedQty(qty)}
              className={cn(
                "flex h-14 w-14 items-center justify-center border text-sm font-bold tracking-widest transition-colors",
                selectedQty === qty
                  ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                  : "border-brand-gold/50 text-brand-gold/70 hover:border-brand-gold hover:text-brand-gold"
              )}
            >
              {qty}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-6">
          <Button className="h-14 flex-1 bg-brand-gold text-sm font-bold tracking-widest text-[#050505] hover:bg-brand-gold-dark">
            ADD TO CART
          </Button>
          <Button
            variant="outline"
            className="h-14 flex-1 border-brand-gold text-sm font-bold tracking-widest text-brand-gold hover:bg-brand-gold/10"
          >
            Add to Wishlist
          </Button>
        </div>

        <Separator className="bg-[#333]" />

        {/* Details Accordion */}
        <button
          onClick={() => setDetailsOpen(!detailsOpen)}
          className="flex w-full items-center justify-between text-sm font-semibold tracking-[0.1em] text-brand-gold"
        >
          <span>DETAILS</span>
          <span>{detailsOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}</span>
        </button>
        {detailsOpen && (
          <div className="text-base leading-[1.7] text-[#e0e0e0]">
            {bookDetails.map((detail) => (
              <p key={detail.label}>
                <span className="font-bold">{detail.label}</span>
                <span className="text-[#e0e0e0]">
                  {" "}
                  : {detail.value}
                </span>
              </p>
            ))}
          </div>
        )}

        <Separator className="bg-[#333]" />

        {/* Shipping Accordion */}
        <button
          onClick={() => setShippingOpen(!shippingOpen)}
          className="flex w-full items-center justify-between text-sm font-semibold tracking-[0.1em] text-brand-gold"
        >
          <span>SHIPPING</span>
          <span>{shippingOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}</span>
        </button>
        {shippingOpen && (
          <div className="text-base leading-[1.7] text-[#e0e0e0]">
            <p>Free shipping on orders over $50.</p>
            <p>Standard delivery: 5-7 business days.</p>
            <p>Express delivery: 2-3 business days.</p>
          </div>
        )}

        {/* Bottom spacer for sticky calculation */}
        <div className="h-8" />
      </div>
    </div>
  )
}

/* ─── Recommended Product Card ─── */
function RecommendedCard({
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
        <Image
          src={image}
          alt={title}
          width={290}
          height={290}
          className="h-auto max-h-[290px] w-auto max-w-[290px] object-contain"
        />
      </div>
      <div className="relative flex flex-col items-center gap-2 text-center">
        <h3 className="font-heading text-[32px] font-bold leading-[1.4] tracking-tight text-[#e0e0e0]">
          {title}
        </h3>
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

/* ─── Recommended Products Section ─── */
function RecommendedSection() {
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
          {recommendedProducts.map((product) => (
            <RecommendedCard key={product.title} {...product} />
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
            <div className="flex flex-col items-end">
              <Button className="h-14 w-14 bg-brand-gold p-0 hover:bg-brand-gold-dark">
                <ChevronRight className="h-6 w-6 text-[#050505]" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Product Detail Page ─── */
export default function RaisonDEtrePage() {
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
          <ProductImages />
          <ProductDetails />
        </div>
      </section>

      <RecommendedSection />
      <TestimonialSection />
    </div>
  )
}
