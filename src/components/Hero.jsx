import { useState, useRef, useEffect, useCallback } from 'react'
import {
  ArrowRight,
  MessageCircle,
  Star,
  ShoppingBag,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useCartStore, MOCK_PRODUCTS } from '../store/cartStore'

// Flagship products curated for the Desktop Bento Gallery
const DESKTOP_BENTO_ITEMS = [
  {
    id: 1,
    name: 'AeroPro Wireless ANC Studio',
    subtitle: '48dB Hybrid ANC · 40mm Ti Drivers',
    badge: 'FLAGSHIP AUDIO',
    price: 3499,
    originalPrice: 6999,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=80',
    tag: 'Hi-Res Certified',
  },
  {
    id: 5,
    name: 'PulseSync Ultra Titanium',
    subtitle: 'Aerospace Titanium · 1.96" AMOLED',
    badge: 'TITANIUM 49MM',
    price: 2999,
    originalPrice: 5999,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900&q=80',
    tag: 'MIL-STD-810H',
  },
  {
    id: 9,
    name: 'HyperGaN 140W Desktop Charger',
    subtitle: 'PD 3.1 Fast Charge · 4-Port GaN III',
    badge: '140W GaN III',
    price: 2499,
    originalPrice: 4999,
    image: 'https://images.unsplash.com/photo-1622445268462-337fbf868d60?w=900&q=80',
    tag: 'PD 3.1 Ultra',
  },
  {
    id: 3,
    name: 'SonicPulse Hi-Fi Studio Monitors',
    subtitle: '80W RMS Near-Field Reference Pair',
    badge: 'STUDIO ACOUSTICS',
    price: 5499,
    originalPrice: 9999,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=900&q=80',
    tag: 'Audiophile Grade',
  },
  {
    id: 2,
    name: 'QuantumBass Pro Earbuds',
    subtitle: '38ms Low Latency · 40h Playtime',
    badge: '38ms GAMING',
    price: 1899,
    originalPrice: 3999,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=900&q=80',
    tag: 'IPX5 Splash',
  },
  {
    id: 4,
    name: 'EchoBar 120W Dolby Atmos Soundbar',
    subtitle: 'Spatial 3D Audio · HDMI eARC',
    badge: 'DOLBY ATMOS',
    price: 6299,
    originalPrice: 11999,
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=900&q=80',
    tag: 'Spatial Audio',
  },
]

export default function Hero() {
  const [ref, isVisible] = useScrollReveal(0.05)
  const carouselRef = useRef(null)
  const touchTimeoutRef = useRef(null)

  const rawProducts = useCartStore((s) => s.products) || MOCK_PRODUCTS
  const allProducts = rawProducts.filter((p) => !p.isHidden)
  const productList = allProducts.length > 0 ? allProducts : MOCK_PRODUCTS

  // Create a 3x loop list for seamless infinite horizontal scrolling on mobile
  const infiniteList = [...productList, ...productList, ...productList]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isInteracting, setIsInteracting] = useState(false)

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

  // Measure card width + gap dynamically
  const getCardMetrics = useCallback(() => {
    if (!carouselRef.current) return { cardWidth: 280, singleSetWidth: 280 * productList.length }
    const container = carouselRef.current
    const firstCard = container.querySelector('[data-bento-card]')
    const cardWidth = firstCard ? firstCard.offsetWidth + 12 : container.clientWidth * 0.78 + 12
    const singleSetWidth = cardWidth * productList.length
    return { cardWidth, singleSetWidth }
  }, [productList.length])

  // Center initial scroll position to the middle duplicate set on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (carouselRef.current && productList.length > 0) {
        const { singleSetWidth } = getCardMetrics()
        carouselRef.current.scrollLeft = singleSetWidth
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [getCardMetrics, productList.length])

  // Continuous Seamless Infinite Wrap Detection & Live Index Tracker
  const handleScroll = () => {
    if (!carouselRef.current) return
    const container = carouselRef.current
    const { cardWidth, singleSetWidth } = getCardMetrics()
    if (singleSetWidth <= 0 || cardWidth <= 0) return

    // Invisible Wrap-Around: If reached near the end of set 2, shift back to set 1 without visual interruption
    if (container.scrollLeft >= singleSetWidth * 2) {
      container.scrollLeft -= singleSetWidth
    } else if (container.scrollLeft <= 10) {
      container.scrollLeft += singleSetWidth
    }

    // Determine currently displayed product index (0 to productList.length - 1)
    const normalizedScroll = (container.scrollLeft % singleSetWidth) + cardWidth * 0.3
    const index = Math.floor(normalizedScroll / cardWidth) % productList.length
    setCurrentIndex(Math.max(0, index))
  }

  // Smooth Auto-Play Reel: Advances to next product every 3.5 seconds when not touched
  useEffect(() => {
    if (isInteracting) return

    const interval = setInterval(() => {
      if (!carouselRef.current) return
      const { cardWidth } = getCardMetrics()
      carouselRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' })
    }, 3500)

    return () => clearInterval(interval)
  }, [isInteracting, getCardMetrics])

  // Touch & Drag interaction handlers to pause autoplay smoothly
  const handleTouchStart = () => {
    setIsInteracting(true)
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current)
  }

  const handleTouchEnd = () => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current)
    touchTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false)
    }, 3000)
  }

  // Manual Prev / Next arrow buttons for mobile
  const handleManualNav = (direction) => {
    if (!carouselRef.current) return
    setIsInteracting(true)
    const { cardWidth } = getCardMetrics()
    carouselRef.current.scrollBy({
      left: direction * cardWidth,
      behavior: 'smooth',
    })
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current)
    touchTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false)
    }, 4000)
  }

  const activeProduct = productList[currentIndex] || productList[0]

  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] pt-20 sm:pt-28 pb-12 sm:pb-20">
      {/* Subtle Warm Atmospheric Glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#F5EFEA] blur-3xl opacity-60" />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-[#FDF2F4] blur-3xl opacity-50" />

      <div ref={ref} className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main 2-Column Split: Content & Bento Gallery */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          
          {/* ──────── LEFT COLUMN: Brand Story, Typography, CTAs & Social Proof ──────── */}
          <div
            className={`lg:col-span-5 xl:col-span-5 flex flex-col justify-center text-left transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Pill Tag with Glowing Crimson Dot */}
            <div className="inline-flex items-center self-start">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-[#FDF2F4] text-[#991B33] border border-[#F7CCD5] shadow-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-[#991B33] animate-pulse" />
                <span>Scope Internationals</span>
                <span className="text-[#991B33]/40">•</span>
                <span>Flagship 2026</span>
              </span>
            </div>

            {/* Editorial Serif Main Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[46px] xl:text-[52px] font-bold text-[#1C1917] tracking-tight leading-[1.14] mt-4 sm:mt-5">
              Precision Engineered Sound &amp; Flagship Tech.
            </h1>

            {/* Body Copy */}
            <p className="mt-3.5 sm:mt-5 text-sm sm:text-base leading-relaxed text-[#57534E] max-w-xl font-sans">
              Discover certified High-Fidelity Audio, Aerospace Titanium Wearables, and GaN Hyper-Fast Charging engineered for uncompromising acoustic purity and lasting endurance.
            </p>

            {/* Dual CTAs */}
            <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={handleScrollToProducts}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#991B33] hover:bg-[#7E1227] text-white px-6 py-3.5 text-xs sm:text-sm font-bold tracking-wide transition-all shadow-md shadow-[#991B33]/20 hover:shadow-lg hover:shadow-[#991B33]/30 active:scale-98 cursor-pointer"
              >
                <span>Shop Flagship Devices</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={handleScrollToProducts}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E7E2D9] bg-white hover:bg-[#F4EFEA] text-[#1C1917] px-6 py-3.5 text-xs sm:text-sm font-bold tracking-wide transition-all shadow-xs hover:border-[#D6D0C5] active:scale-98 cursor-pointer"
              >
                <span>Explore Best Sellers</span>
              </button>
            </div>

            {/* Social Proof */}
            <div className="mt-8 pt-6 border-t border-[#EAE5DD] flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] block mb-1.5">Certified Architecture</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['Hi-Res Audio', 'Dolby Atmos', 'Bluetooth 5.4', 'GaN III'].map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-[#E7E2D9] text-[#1C1917]">{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] block mb-1.5">Rated Excellent: 4.9/5</span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                  <span className="text-[11px] font-bold text-[#1C1917] ml-1">12,400+ Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* ──────── RIGHT COLUMN: BENTO GALLERY ──────── */}
          <div
            className={`lg:col-span-7 xl:col-span-7 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* MOBILE VIEW: INFINITE SHOWCASE BENTO RIBBON */}
            <div className="lg:hidden">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#991B33] animate-ping" />
                  <span className="text-xs font-bold text-[#1C1917]">Flagship Showcase</span>
                </div>
                <span className="text-xs font-bold text-[#1C1917] font-mono bg-white px-2.5 py-0.5 rounded-full border border-[#E7E2D9] shadow-2xs">
                  {String(currentIndex + 1).padStart(2, '0')} / {String(productList.length).padStart(2, '0')}
                </span>
              </div>

              <div
                ref={carouselRef}
                onScroll={handleScroll}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onMouseEnter={() => setIsInteracting(true)}
                onMouseLeave={() => setIsInteracting(false)}
                className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-3 pt-1 -mx-4 px-4"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {infiniteList.map((product, idx) => {
                  const isCurrent = idx % productList.length === currentIndex
                  return (
                    <div
                      key={`${product.id}-${idx}`}
                      data-bento-card="true"
                      className="w-[78vw] max-w-[315px] flex-shrink-0 snap-center"
                    >
                      <div
                        onClick={() => handleQuickAdd(product)}
                        className={`relative aspect-[4/5] w-full rounded-3xl overflow-hidden border shadow-lg bg-stone-100 cursor-pointer active:scale-98 transition-all duration-300 ${
                          isCurrent ? 'border-[#991B33]/60 shadow-xl shadow-[#991B33]/10' : 'border-[#E7E2D9]'
                        }`}
                      >
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" loading="eager" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />
                        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#991B33] text-white shadow-xs">{product.badge || 'TECH'}</span>
                        </div>
                        <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10">
                          <h3 className="font-serif text-base font-bold text-white leading-tight line-clamp-1">{product.name}</h3>
                          <div className="mt-2.5 flex items-center justify-between">
                            <span className="font-serif text-lg font-bold text-white">₹{product.price}</span>
                            <button onClick={(e) => handleQuickAdd(product, e)} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-[#1C1917] hover:bg-stone-100 text-xs font-bold tracking-wide shadow-sm">
                              <ShoppingBag className="h-3.5 w-3.5 text-[#991B33]" />
                              <span>Add</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex items-center justify-between mt-3 px-1">
                <button onClick={() => handleManualNav(-1)} className="p-2 rounded-full bg-white border border-[#E7E2D9] text-[#1C1917] shadow-xs"><ChevronLeft className="h-4 w-4" /></button>
                <div className="flex-1 px-4"><div className="w-full h-1.5 bg-[#EAE5DD] rounded-full overflow-hidden"><div className="h-full bg-[#991B33] transition-all duration-300" style={{ width: `${((currentIndex + 1) / productList.length) * 100}%` }} /></div></div>
                <button onClick={() => handleManualNav(1)} className="p-2 rounded-full bg-white border border-[#E7E2D9] text-[#1C1917] shadow-xs"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>

            {/* DESKTOP VIEW: DUAL-COLUMN STAGGERED MASONRY BENTO GRID */}
            <div className="hidden lg:grid grid-cols-2 gap-3.5 xl:gap-4.5">
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

        {/* ──────── 4 STAT METRIC BOXES ──────── */}
        <div
          className={`mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Metric 1 */}
          <div className="rounded-2xl bg-white border border-[#E7E2D9] p-4 sm:p-6 text-center shadow-xs flex flex-col justify-center items-center">
            <span className="font-serif text-2xl sm:text-4xl font-bold text-[#1C1917]">
              4.9 ★
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-wider text-[#78716C] uppercase mt-1">
              Customer Satisfaction
            </span>
          </div>

          {/* Metric 2: Crimson Highlight */}
          <div className="rounded-2xl bg-white border border-[#E7E2D9] p-4 sm:p-6 text-center shadow-xs flex flex-col justify-center items-center">
            <span className="font-serif text-2xl sm:text-4xl font-bold text-[#991B33]">
              100%
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-wider text-[#78716C] uppercase mt-1">
              Genuine Certified Tech
            </span>
          </div>

          {/* Metric 3 */}
          <div className="rounded-2xl bg-white border border-[#E7E2D9] p-4 sm:p-6 text-center shadow-xs flex flex-col justify-center items-center">
            <span className="font-serif text-2xl sm:text-4xl font-bold text-[#1C1917]">
              50,000+
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-wider text-[#78716C] uppercase mt-1">
              Devices Delivered
            </span>
          </div>

          {/* Metric 4: Emerald Green Highlight */}
          <div className="rounded-2xl bg-white border border-[#E7E2D9] p-4 sm:p-6 text-center shadow-xs flex flex-col justify-center items-center">
            <span className="font-serif text-2xl sm:text-4xl font-bold text-[#059669]">
              24 - 48h
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
        title="Contact Scope Internationals Concierge Support"
      >
        <MessageCircle className="h-4 w-4 fill-white" />
        <span>Concierge Desk</span>
      </a>
    </section>
  )
}

