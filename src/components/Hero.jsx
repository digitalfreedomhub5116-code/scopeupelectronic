import { useState, useRef, useEffect, useMemo } from 'react'
import {
  ArrowRight,
  MessageCircle,
  ShoppingBag,
  Star,
} from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useCartStore, MOCK_PRODUCTS } from '../store/cartStore'

// Curated products for Desktop Bento Gallery
const DESKTOP_BENTO_ITEMS = [
  {
    id: 1,
    name: 'Aura Royal Kundan Choker Set',
    subtitle: 'Polki Kundan · 22K Gold Finish · Pearls',
    badge: 'KUNDAN JEWELLERY',
    price: 4499,
    originalPrice: 8999,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900&q=80',
    tag: 'Heirloom Craft',
  },
  {
    id: 5,
    name: 'Hand-Carved Teakwood Ganesha',
    subtitle: 'Single-Block Indian Teak · Master Relief',
    badge: 'ARTISANAL CRAFT',
    price: 3899,
    originalPrice: 7499,
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=900&q=80',
    tag: 'Hand-Carved',
  },
  {
    id: 9,
    name: 'Imperial Vintage Gold Frame',
    subtitle: 'Victorian Baroque Leaf · Archival Float Glass',
    badge: 'GALLERY FRAMES',
    price: 1699,
    originalPrice: 3299,
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=900&q=80',
    tag: 'Gold Foil Gilded',
  },
  {
    id: 24,
    name: 'AeroPro Wireless ANC Studio',
    subtitle: '48dB Hybrid ANC · 40mm Ti Drivers',
    badge: 'STUDIO ACOUSTICS',
    price: 3499,
    originalPrice: 6999,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=80',
    tag: 'Hi-Res Certified',
  },
  {
    id: 17,
    name: 'MagSafe Italian Leather Case',
    subtitle: 'Full-Grain Calfskin · N52 Magnets',
    badge: 'MOBILE ESSENTIALS',
    price: 1499,
    originalPrice: 2999,
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=900&q=80',
    tag: 'Italian Leather',
  },
  {
    id: 13,
    name: 'Saddle Leather Monogram Keychain',
    subtitle: '4mm Full-Grain Leather · Solid Brass',
    badge: 'HANDCRAFTED GIFTS',
    price: 699,
    originalPrice: 1399,
    image: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?w=900&q=80',
    tag: 'Natural Patina',
  },
]

// Smooth cubic ease-out count-up animation hook
function useCounter(target, duration, delay, isTriggered, isFloat = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isTriggered) return
    let startTime = null
    let animFrame = null
    const timeoutId = setTimeout(() => {
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)
        // Cubic ease-out: 1 - (1 - t)^3
        const easeProgress = 1 - Math.pow(1 - progress, 3)
        const current = target * easeProgress
        setCount(isFloat ? current : Math.round(current))

        if (progress < 1) {
          animFrame = requestAnimationFrame(animate)
        }
      }
      animFrame = requestAnimationFrame(animate)
    }, delay)

    return () => {
      clearTimeout(timeoutId)
      if (animFrame) cancelAnimationFrame(animFrame)
    }
  }, [isTriggered, target, duration, delay, isFloat])

  return count
}

export default function Hero() {
  const [ref, isVisible] = useScrollReveal(0.05)
  const carouselRef = useRef(null)
  const singleSetWidthRef = useRef(0)

  // Staggered animated counters for the 4 metric boxes
  const count1 = useCounter(4.9, 900, 200, isVisible, true)
  const count2 = useCounter(100, 900, 400, isVisible, false)
  const count3 = useCounter(50000, 1100, 600, isVisible, false)
  const count4A = useCounter(24, 900, 800, isVisible, false)
  const count4B = useCounter(48, 900, 800, isVisible, false)

  const rawProducts = useCartStore((s) => s.products) || MOCK_PRODUCTS
  const allProducts = rawProducts.filter((p) => !p.isHidden)
  const productList = allProducts.length > 0 ? allProducts : MOCK_PRODUCTS

  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  const handleQuickAdd = (productData, e) => {
    if (e) e.stopPropagation()
    const fullProduct = productList.find((p) => p.id === productData.id) || productData
    addItem(fullProduct)
    openCart()
  }

  const handleScrollToProducts = () => {
    const el = document.querySelector('#products')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // ── Construct Dynamic Irregular Bento Pattern Modules ──
  // Alternates: Single Tall Card -> Stacked (Tall+Short) -> Single Wide Card -> Stacked (Short+Tall)
  const bentoModules = useMemo(() => {
    if (!productList || productList.length === 0) return []
    const mods = []
    let i = 0

    while (i < productList.length) {
      const patternIdx = mods.length % 4

      if (patternIdx === 0) {
        // Module 1: Single Tall Portrait Card (w-[70vw] max-w-[280px])
        mods.push({
          id: `mod-${mods.length}`,
          type: 'single-tall',
          width: 'w-[70vw] max-w-[280px]',
          product: productList[i],
        })
        i += 1
      } else if (patternIdx === 1) {
        // Module 2: Stacked Pair with Taller Top (185px) & Compact Bottom (145px)
        const p1 = productList[i]
        const p2 = productList[i + 1] || productList[0]
        mods.push({
          id: `mod-${mods.length}`,
          type: 'stacked-pair-1',
          width: 'w-[64vw] max-w-[250px]',
          topProduct: p1,
          bottomProduct: p2,
        })
        i += 2
      } else if (patternIdx === 2) {
        // Module 3: Single Wide Landscape Card (w-[76vw] max-w-[310px])
        mods.push({
          id: `mod-${mods.length}`,
          type: 'single-wide',
          width: 'w-[76vw] max-w-[310px]',
          product: productList[i],
        })
        i += 1
      } else {
        // Module 4: Inverted Stacked Pair with Compact Top (145px) & Taller Bottom (185px)
        const p1 = productList[i]
        const p2 = productList[i + 1] || productList[0]
        mods.push({
          id: `mod-${mods.length}`,
          type: 'stacked-pair-2',
          width: 'w-[64vw] max-w-[250px]',
          topProduct: p1,
          bottomProduct: p2,
        })
        i += 2
      }
    }
    return mods
  }, [productList])

  // 3x duplicate loop array for seamless infinite auto-scroll
  const infiniteModules = useMemo(() => {
    if (bentoModules.length === 0) return []
    return [...bentoModules, ...bentoModules, ...bentoModules]
  }, [bentoModules])

  // Measure single set width on mount & position initial scroll at the middle duplicate
  useEffect(() => {
    const timer = setTimeout(() => {
      if (carouselRef.current && bentoModules.length > 0) {
        const el = carouselRef.current
        const moduleEls = el.querySelectorAll('[data-bento-module]')
        if (moduleEls.length >= bentoModules.length) {
          let setWidth = 0
          for (let i = 0; i < bentoModules.length; i++) {
            if (moduleEls[i]) {
              setWidth += moduleEls[i].offsetWidth + 12 // width + gap
            }
          }
          singleSetWidthRef.current = setWidth
          el.scrollLeft = setWidth
        }
      }
    }, 200)
    return () => clearTimeout(timer)
  }, [bentoModules])

  // ── 60FPS Ambient Fluid Auto-Scroll Reel ──
  useEffect(() => {
    const el = carouselRef.current
    if (!el) return

    let animId
    const scrollSpeed = 0.8 // Smooth, continuous luxury drift (~48px/sec)

    const step = () => {
      if (el) {
        el.scrollLeft += scrollSpeed

        const setWidth = singleSetWidthRef.current
        if (setWidth > 0) {
          // Seamless infinite wrap around
          if (el.scrollLeft >= setWidth * 2) {
            el.scrollLeft -= setWidth
          } else if (el.scrollLeft <= 5) {
            el.scrollLeft += setWidth
          }
        }
      }
      animId = requestAnimationFrame(step)
    }

    animId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <section className="relative overflow-hidden bg-[#FAF8F5]">
      {/* Subtle Warm Atmospheric Glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#F5EFEA] blur-3xl opacity-60" />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-[#FDF2F4] blur-3xl opacity-50" />

      <div ref={ref} className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ──────── MOBILE: Full-Screen Centered Hero with 4 Metric Boxes ──────── */}
        <div
          className={`flex flex-col items-center justify-center text-center min-h-[100svh] pt-32 pb-8 lg:hidden transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Realistic Indian-Oriented Social Proof Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-[#E7E2D9] shadow-xs mb-3 backdrop-blur-sm">
            <div className="flex -space-x-1.5 overflow-hidden">
              <img
                className="inline-block h-4 w-4 rounded-full ring-1 ring-white object-cover"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Buyer review"
              />
              <img
                className="inline-block h-4 w-4 rounded-full ring-1 ring-white object-cover"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                alt="Buyer review"
              />
              <img
                className="inline-block h-4 w-4 rounded-full ring-1 ring-white object-cover"
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
                alt="Buyer review"
              />
            </div>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              <span className="text-[11px] font-extrabold text-[#1C1917]">4.9</span>
            </div>
            <span className="text-[10px] font-semibold text-[#78716C]">
              · 12,000+ Happy Customers Across India
            </span>
          </div>

          {/* Centered Headline */}
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917] tracking-tight leading-[1.2] max-w-xs sm:max-w-sm">
            Artisanal Crafts, Luxury Jewellery & Premium Tech.
          </h1>

          {/* Dual CTAs (Side by side for mobile vertical compactness) */}
          <div className="mt-4 flex items-center justify-center gap-2.5 w-full max-w-xs px-2">
            <button
              onClick={handleScrollToProducts}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#991B33] hover:bg-[#7E1227] text-white px-4 py-2.5 text-xs font-bold tracking-wide transition-all shadow-md shadow-[#991B33]/20 active:scale-98 cursor-pointer whitespace-nowrap"
            >
              <span>Shop All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleScrollToProducts}
              className="flex-1 inline-flex items-center justify-center rounded-full border border-[#E7E2D9] bg-white hover:bg-[#F4EFEA] text-[#1C1917] px-4 py-2.5 text-xs font-bold tracking-wide transition-all shadow-xs hover:border-[#D6D0C5] active:scale-98 cursor-pointer whitespace-nowrap"
            >
              <span>Best Sellers</span>
            </button>
          </div>

          {/* 4 Stat Metric Boxes with Staggered Slide-Up & Count-Up Animation */}
          <div className="mt-6 grid grid-cols-2 gap-2.5 w-full max-w-sm px-2">
            {/* Metric 1 */}
            <div
              className={`rounded-2xl bg-white border border-[#E7E2D9] p-3 text-center shadow-xs flex flex-col justify-center items-center transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <span className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917]">
                {count1.toFixed(1)} ★
              </span>
              <span className="text-[9px] font-bold tracking-wider text-[#78716C] uppercase mt-0.5 leading-tight">
                Customer Satisfaction
              </span>
            </div>

            {/* Metric 2: Crimson Highlight */}
            <div
              className={`rounded-2xl bg-white border border-[#E7E2D9] p-3 text-center shadow-xs flex flex-col justify-center items-center transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 scale-95'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              <span className="font-serif text-xl sm:text-2xl font-bold text-[#991B33]">
                {count2}%
              </span>
              <span className="text-[9px] font-bold tracking-wider text-[#78716C] uppercase mt-0.5 leading-tight">
                Authentic & Handcrafted
              </span>
            </div>

            {/* Metric 3 */}
            <div
              className={`rounded-2xl bg-white border border-[#E7E2D9] p-3 text-center shadow-xs flex flex-col justify-center items-center transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 scale-95'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              <span className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917]">
                {count3.toLocaleString('en-IN')}+
              </span>
              <span className="text-[9px] font-bold tracking-wider text-[#78716C] uppercase mt-0.5 leading-tight">
                Happy Customers
              </span>
            </div>

            {/* Metric 4: Emerald Green Highlight */}
            <div
              className={`rounded-2xl bg-white border border-[#E7E2D9] p-3 text-center shadow-xs flex flex-col justify-center items-center transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 scale-95'
              }`}
              style={{ transitionDelay: '800ms' }}
            >
              <span className="font-serif text-xl sm:text-2xl font-bold text-[#059669]">
                {count4A} - {count4B}h
              </span>
              <span className="text-[9px] font-bold tracking-wider text-[#78716C] uppercase mt-0.5 leading-tight">
                Express Courier Dispatch
              </span>
            </div>
          </div>
        </div>

        {/* ──────── MOBILE VIEW (< 1024px): BENTO CAROUSEL (Shifted below first screen, revealed on scroll) ──────── */}
        <div className="lg:hidden pb-16 pt-4 overflow-hidden -mx-4 px-4">
          <div
            ref={carouselRef}
            className="flex gap-3 overflow-x-hidden no-scrollbar pb-2 pt-1 h-[340px] items-stretch"
          >
            {infiniteModules.map((mod, idx) => {
              // 1. Single Tall Card
              if (mod.type === 'single-tall' || mod.type === 'single-wide') {
                return (
                  <div
                    key={`mod-${idx}`}
                    data-bento-module="true"
                    className={`${mod.width} flex-shrink-0 h-full`}
                  >
                    <div
                      onClick={() => handleQuickAdd(mod.product)}
                      className="relative h-full w-full rounded-3xl overflow-hidden border border-[#E7E2D9] shadow-md bg-stone-100 cursor-pointer active:scale-98 transition-all duration-300 group"
                    >
                      <img
                        src={mod.product.image}
                        alt={mod.product.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading={idx < 6 ? 'eager' : 'lazy'}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />

                      {/* Bottom Details */}
                      <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10">
                        <h3 className="font-serif text-base font-bold text-white leading-tight line-clamp-1">
                          {mod.product.name}
                        </h3>
                        <p className="text-[11px] text-white/80 mt-0.5 line-clamp-1 font-sans">
                          {mod.product.chipset || mod.product.anc || mod.product.material || mod.product.description}
                        </p>
                        <div className="mt-2.5 flex items-center justify-between">
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-serif text-lg font-bold text-white">
                              ₹{mod.product.price}
                            </span>
                            {mod.product.originalPrice && (
                              <span className="text-xs text-white/60 line-through">
                                ₹{mod.product.originalPrice}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={(e) => handleQuickAdd(mod.product, e)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[#1C1917] hover:bg-stone-100 text-xs font-bold tracking-wide shadow-sm cursor-pointer active:scale-95 transition-all"
                          >
                            <ShoppingBag className="h-3 w-3 text-[#991B33]" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }

              // 2. Stacked Pair (Top: 185px, Bottom: 145px) or Inverted (Top: 145px, Bottom: 185px)
              const isPair1 = mod.type === 'stacked-pair-1'
              const topHeight = isPair1 ? 'h-[185px]' : 'h-[145px]'
              const bottomHeight = isPair1 ? 'h-[145px]' : 'h-[185px]'

              return (
                <div
                  key={`mod-${idx}`}
                  data-bento-module="true"
                  className={`${mod.width} flex-shrink-0 h-full flex flex-col justify-between gap-2.5`}
                >
                  {/* Top Card */}
                  <div
                    onClick={() => handleQuickAdd(mod.topProduct)}
                    className={`relative ${topHeight} w-full rounded-2xl overflow-hidden border border-[#E7E2D9] shadow-xs bg-stone-100 cursor-pointer active:scale-98 transition-all group`}
                  >
                    <img
                      src={mod.topProduct.image}
                      alt={mod.topProduct.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading={idx < 6 ? 'eager' : 'lazy'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex items-end justify-between">
                      <div className="max-w-[70%]">
                        <h4 className="font-serif text-xs font-bold text-white line-clamp-1">
                          {mod.topProduct.name}
                        </h4>
                        <span className="text-xs font-bold text-amber-300">
                          ₹{mod.topProduct.price}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleQuickAdd(mod.topProduct, e)}
                        className="p-1.5 rounded-full bg-white text-[#1C1917] hover:bg-stone-100 shadow-xs cursor-pointer active:scale-95"
                        title="Add to Bag"
                      >
                        <ShoppingBag className="h-3 w-3 text-[#991B33]" />
                      </button>
                    </div>
                  </div>

                  {/* Bottom Card */}
                  <div
                    onClick={() => handleQuickAdd(mod.bottomProduct)}
                    className={`relative ${bottomHeight} w-full rounded-2xl overflow-hidden border border-[#E7E2D9] shadow-xs bg-stone-100 cursor-pointer active:scale-98 transition-all group`}
                  >
                    <img
                      src={mod.bottomProduct.image}
                      alt={mod.bottomProduct.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading={idx < 6 ? 'eager' : 'lazy'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
                    <div className="absolute bottom-2 left-2 right-2 z-10 flex items-end justify-between">
                      <div className="max-w-[70%]">
                        <h4 className="font-serif text-[11px] font-bold text-white line-clamp-1">
                          {mod.bottomProduct.name}
                        </h4>
                        <span className="text-xs font-bold text-amber-300">
                          ₹{mod.bottomProduct.price}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleQuickAdd(mod.bottomProduct, e)}
                        className="p-1.5 rounded-full bg-white text-[#1C1917] hover:bg-stone-100 shadow-xs cursor-pointer active:scale-95"
                        title="Add to Bag"
                      >
                        <ShoppingBag className="h-3 w-3 text-[#991B33]" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ──────── DESKTOP: 2-Column Split (lg+) ──────── */}
        <div className="hidden lg:grid grid-cols-12 items-center gap-12 xl:gap-16 pt-28 pb-20">
          <div
            className={`col-span-5 xl:col-span-5 flex flex-col justify-center text-left transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h1 className="font-serif text-[46px] xl:text-[52px] font-bold text-[#1C1917] tracking-tight leading-[1.14]">
              Artisanal Crafts, Luxury Jewellery & Premium Tech.
            </h1>

            <div className="mt-7 flex flex-row items-center gap-3">
              <button
                onClick={handleScrollToProducts}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#991B33] hover:bg-[#7E1227] text-white px-6 py-3.5 text-sm font-bold tracking-wide transition-all shadow-md shadow-[#991B33]/20 hover:shadow-lg hover:shadow-[#991B33]/30 active:scale-98 cursor-pointer"
              >
                <span>Shop All Collections</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={handleScrollToProducts}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E7E2D9] bg-white hover:bg-[#F4EFEA] text-[#1C1917] px-6 py-3.5 text-sm font-bold tracking-wide transition-all shadow-xs hover:border-[#D6D0C5] active:scale-98 cursor-pointer"
              >
                <span>Explore Best Sellers</span>
              </button>
            </div>
          </div>

          {/* ──────── RIGHT COLUMN: DESKTOP BENTO GALLERY ──────── */}
          <div
            className={`col-span-7 xl:col-span-7 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* DESKTOP VIEW: DUAL-COLUMN STAGGERED MASONRY BENTO GRID */}
            <div className="grid grid-cols-2 gap-3.5 xl:gap-4.5">
              {/* Left Staggered Column */}
              <div className="space-y-3.5 xl:space-y-4.5">
                {/* 1. AeroPro Studio ANC Headphones */}
                <div
                  onClick={() => handleQuickAdd(DESKTOP_BENTO_ITEMS[0])}
                  className="group relative h-[280px] xl:h-[300px] w-full rounded-3xl overflow-hidden border border-[#E7E2D9] shadow-md bg-stone-100 cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-[#991B33]/40"
                >
                  <img
                    src={DESKTOP_BENTO_ITEMS[0].image}
                    alt={DESKTOP_BENTO_ITEMS[0].name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/5" />
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#991B33] text-white shadow-xs">
                      {DESKTOP_BENTO_ITEMS[0].badge}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-[#1C1917] border border-white/40">
                      {DESKTOP_BENTO_ITEMS[0].tag}
                    </span>
                  </div>
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 flex items-end justify-between">
                    <div>
                      <h3 className="font-serif text-base xl:text-lg font-bold text-white leading-tight">
                        {DESKTOP_BENTO_ITEMS[0].name}
                      </h3>
                      <p className="text-xs text-white/80 mt-0.5 font-sans">
                        {DESKTOP_BENTO_ITEMS[0].subtitle}
                      </p>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="font-serif text-lg font-bold text-white">
                          ₹{DESKTOP_BENTO_ITEMS[0].price}
                        </span>
                        <span className="text-xs text-white/60 line-through">
                          ₹{DESKTOP_BENTO_ITEMS[0].originalPrice}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleQuickAdd(DESKTOP_BENTO_ITEMS[0], e)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-stone-100 text-[#1C1917] text-xs font-bold tracking-wide shadow-sm transition-all transform group-hover:scale-105 active:scale-95"
                    >
                      <ShoppingBag className="h-3.5 w-3.5 text-[#991B33]" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* 2. HyperGaN 140W Desktop Charger */}
                <div
                  onClick={() => handleQuickAdd(DESKTOP_BENTO_ITEMS[2])}
                  className="group relative h-[180px] xl:h-[195px] w-full rounded-3xl overflow-hidden border border-[#E7E2D9] shadow-md bg-stone-100 cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-[#991B33]/40"
                >
                  <img
                    src={DESKTOP_BENTO_ITEMS[2].image}
                    alt={DESKTOP_BENTO_ITEMS[2].name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-[#1C1917]">
                      {DESKTOP_BENTO_ITEMS[2].badge}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 z-10 flex items-end justify-between">
                    <div>
                      <h4 className="font-serif text-sm xl:text-base font-bold text-white line-clamp-1">
                        {DESKTOP_BENTO_ITEMS[2].name}
                      </h4>
                      <span className="font-serif text-sm font-bold text-amber-300">
                        ₹{DESKTOP_BENTO_ITEMS[2].price}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleQuickAdd(DESKTOP_BENTO_ITEMS[2], e)}
                      className="p-2 rounded-full bg-white hover:bg-stone-100 text-[#1C1917] shadow-sm transition-transform group-hover:scale-105 active:scale-95"
                      title="Add to Bag"
                    >
                      <ShoppingBag className="h-3.5 w-3.5 text-[#991B33]" />
                    </button>
                  </div>
                </div>

                {/* 3. SonicPulse Studio Monitors */}
                <div
                  onClick={() => handleQuickAdd(DESKTOP_BENTO_ITEMS[3])}
                  className="group relative h-[210px] xl:h-[225px] w-full rounded-3xl overflow-hidden border border-[#E7E2D9] shadow-md bg-stone-100 cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-[#991B33]/40"
                >
                  <img
                    src={DESKTOP_BENTO_ITEMS[3].image}
                    alt={DESKTOP_BENTO_ITEMS[3].name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1C1917] text-white">
                      {DESKTOP_BENTO_ITEMS[3].badge}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 z-10 flex items-end justify-between">
                    <div>
                      <h4 className="font-serif text-sm xl:text-base font-bold text-white line-clamp-1">
                        {DESKTOP_BENTO_ITEMS[3].name}
                      </h4>
                      <span className="font-serif text-sm font-bold text-white">
                        ₹{DESKTOP_BENTO_ITEMS[3].price}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleQuickAdd(DESKTOP_BENTO_ITEMS[3], e)}
                      className="p-2 rounded-full bg-white hover:bg-stone-100 text-[#1C1917] shadow-sm transition-transform group-hover:scale-105 active:scale-95"
                      title="Add to Bag"
                    >
                      <ShoppingBag className="h-3.5 w-3.5 text-[#991B33]" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Staggered Column */}
              <div className="space-y-3.5 xl:space-y-4.5 pt-6 xl:pt-8">
                {/* 4. PulseSync Ultra Titanium Smartwatch */}
                <div
                  onClick={() => handleQuickAdd(DESKTOP_BENTO_ITEMS[1])}
                  className="group relative h-[250px] xl:h-[270px] w-full rounded-3xl overflow-hidden border border-[#E7E2D9] shadow-md bg-stone-100 cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-[#991B33]/40"
                >
                  <img
                    src={DESKTOP_BENTO_ITEMS[1].image}
                    alt={DESKTOP_BENTO_ITEMS[1].name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/5" />
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#1C1917] text-white">
                      {DESKTOP_BENTO_ITEMS[1].badge}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-[#1C1917]">
                      {DESKTOP_BENTO_ITEMS[1].tag}
                    </span>
                  </div>
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 flex items-end justify-between">
                    <div>
                      <h3 className="font-serif text-base xl:text-lg font-bold text-white leading-tight">
                        {DESKTOP_BENTO_ITEMS[1].name}
                      </h3>
                      <p className="text-xs text-white/80 mt-0.5 font-sans">
                        {DESKTOP_BENTO_ITEMS[1].subtitle}
                      </p>
                      <span className="font-serif text-lg font-bold text-amber-300 mt-1 block">
                        ₹{DESKTOP_BENTO_ITEMS[1].price}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleQuickAdd(DESKTOP_BENTO_ITEMS[1], e)}
                      className="p-2 rounded-full bg-white hover:bg-stone-100 text-[#1C1917] shadow-sm transition-transform group-hover:scale-105 active:scale-95"
                      title="Add to Bag"
                    >
                      <ShoppingBag className="h-3.5 w-3.5 text-[#991B33]" />
                    </button>
                  </div>
                </div>

                {/* 5. QuantumBass Pro True Wireless Earbuds */}
                <div
                  onClick={() => handleQuickAdd(DESKTOP_BENTO_ITEMS[4])}
                  className="group relative h-[190px] xl:h-[205px] w-full rounded-3xl overflow-hidden border border-[#E7E2D9] shadow-md bg-stone-100 cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-[#991B33]/40"
                >
                  <img
                    src={DESKTOP_BENTO_ITEMS[4].image}
                    alt={DESKTOP_BENTO_ITEMS[4].name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-[#1C1917]">
                      {DESKTOP_BENTO_ITEMS[4].badge}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 z-10 flex items-end justify-between">
                    <div>
                      <h4 className="font-serif text-sm xl:text-base font-bold text-white line-clamp-1">
                        {DESKTOP_BENTO_ITEMS[4].name}
                      </h4>
                      <span className="font-serif text-sm font-bold text-white">
                        ₹{DESKTOP_BENTO_ITEMS[4].price}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleQuickAdd(DESKTOP_BENTO_ITEMS[4], e)}
                      className="p-2 rounded-full bg-white hover:bg-stone-100 text-[#1C1917] shadow-sm transition-transform group-hover:scale-105 active:scale-95"
                      title="Add to Bag"
                    >
                      <ShoppingBag className="h-3.5 w-3.5 text-[#991B33]" />
                    </button>
                  </div>
                </div>

                {/* 6. EchoBar 120W Dolby Atmos Soundbar */}
                <div
                  onClick={() => handleQuickAdd(DESKTOP_BENTO_ITEMS[5])}
                  className="group relative h-[210px] xl:h-[225px] w-full rounded-3xl overflow-hidden border border-[#E7E2D9] shadow-md bg-stone-100 cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-[#991B33]/40"
                >
                  <img
                    src={DESKTOP_BENTO_ITEMS[5].image}
                    alt={DESKTOP_BENTO_ITEMS[5].name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#991B33] text-white">
                      {DESKTOP_BENTO_ITEMS[5].badge}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 z-10 flex items-end justify-between">
                    <div>
                      <h4 className="font-serif text-sm xl:text-base font-bold text-white line-clamp-1">
                        {DESKTOP_BENTO_ITEMS[5].name}
                      </h4>
                      <span className="font-serif text-sm font-bold text-white">
                        ₹{DESKTOP_BENTO_ITEMS[5].price}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleQuickAdd(DESKTOP_BENTO_ITEMS[5], e)}
                      className="p-2 rounded-full bg-white hover:bg-stone-100 text-[#1C1917] shadow-sm transition-transform group-hover:scale-105 active:scale-95"
                      title="Add to Bag"
                    >
                      <ShoppingBag className="h-3.5 w-3.5 text-[#991B33]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ──────── 4 STAT METRIC BOXES (Desktop view below bento) ──────── */}
        <div
          className="hidden lg:grid mt-12 sm:mt-16 grid-cols-4 gap-4"
        >
          {/* Metric 1 */}
          <div
            className={`rounded-2xl bg-white border border-[#E7E2D9] p-4 sm:p-6 text-center shadow-xs flex flex-col justify-center items-center transition-all duration-700 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <span className="font-serif text-2xl sm:text-4xl font-bold text-[#1C1917]">
              {count1.toFixed(1)} ★
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-wider text-[#78716C] uppercase mt-1">
              Customer Satisfaction
            </span>
          </div>

          {/* Metric 2: Crimson Highlight */}
          <div
            className={`rounded-2xl bg-white border border-[#E7E2D9] p-4 sm:p-6 text-center shadow-xs flex flex-col justify-center items-center transition-all duration-700 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <span className="font-serif text-2xl sm:text-4xl font-bold text-[#991B33]">
              {count2}%
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-wider text-[#78716C] uppercase mt-1">
              Genuine Certified Tech
            </span>
          </div>

          {/* Metric 3 */}
          <div
            className={`rounded-2xl bg-white border border-[#E7E2D9] p-4 sm:p-6 text-center shadow-xs flex flex-col justify-center items-center transition-all duration-700 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '600ms' }}
          >
            <span className="font-serif text-2xl sm:text-4xl font-bold text-[#1C1917]">
              {count3.toLocaleString('en-IN')}+
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-wider text-[#78716C] uppercase mt-1">
              Devices Delivered
            </span>
          </div>

          {/* Metric 4: Emerald Green Highlight */}
          <div
            className={`rounded-2xl bg-white border border-[#E7E2D9] p-4 sm:p-6 text-center shadow-xs flex flex-col justify-center items-center transition-all duration-700 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '800ms' }}
          >
            <span className="font-serif text-2xl sm:text-4xl font-bold text-[#059669]">
              {count4A} - {count4B}h
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-wider text-[#78716C] uppercase mt-1">
              Express Courier Dispatch
            </span>
          </div>
        </div>
      </div>

      {/* Floating Concierge Desk Button */}
      <a
        href="https://wa.me/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-[#00A859] hover:bg-[#008f4c] text-white px-4 py-2.5 text-xs sm:text-sm font-bold shadow-lg shadow-[#00A859]/30 transition-all duration-300 hover:scale-105 active:scale-95"
        title="Contact Scope International Concierge Support"
      >
        <MessageCircle className="h-4 w-4 fill-white" />
        <span>Concierge Desk</span>
      </a>
    </section>
  )
}

