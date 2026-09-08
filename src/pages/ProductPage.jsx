import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Star,
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Share2,
  Heart,
  ChevronRight,
  ChevronLeft,
  ChevronDown
} from 'lucide-react'
import { MOCK_PRODUCTS, useCartStore, GENRES } from '../store/cartStore'
import Footer from '../components/Footer'
import CartDrawer from '../components/CartDrawer'
import WishlistDrawer from '../components/WishlistDrawer'

export default function ProductPage() {
  const { productIdOrSlug } = useParams()
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const toggleWishlist = useCartStore((s) => s.toggleWishlist)

  const allProducts = useCartStore((s) => s.products)

  // Find product by id or slug
  const product = allProducts.find(
    (p) => String(p.id) === productIdOrSlug || p.slug === productIdOrSlug
  )

  const isWishlisted = useCartStore((s) => (product ? s.isWishlisted(product.id) : false))

  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('image')
  const [isCopied, setIsCopied] = useState(false)
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [showNavbar, setShowNavbar] = useState(true)

  const imageSectionRef = useRef(null)
  const descSectionRef = useRef(null)
  const reviewsSectionRef = useRef(null)
  const lastScrollY = useRef(0)

  // Touch and drag swipe state
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const touchEndX = useRef(0)
  const touchEndY = useRef(0)
  const isSwiping = useRef(false)

  const handleNextImage = () => {
    if (!product?.gallery?.length) return
    setActiveImageIndex((prev) => (prev + 1) % product.gallery.length)
  }

  const handlePrevImage = () => {
    if (!product?.gallery?.length) return
    setActiveImageIndex((prev) => (prev - 1 + product.gallery.length) % product.gallery.length)
  }

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    touchEndX.current = e.touches[0].clientX
    touchEndY.current = e.touches[0].clientY
    isSwiping.current = true
  }

  const handleTouchMove = (e) => {
    if (!isSwiping.current) return
    touchEndX.current = e.touches[0].clientX
    touchEndY.current = e.touches[0].clientY
  }

  const handleTouchEnd = () => {
    if (!isSwiping.current) return
    isSwiping.current = false
    const diffX = touchStartX.current - touchEndX.current
    const diffY = touchStartY.current - touchEndY.current
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        handleNextImage()
      } else {
        handlePrevImage()
      }
    }
  }

  const handleMouseDown = (e) => {
    touchStartX.current = e.clientX
    touchStartY.current = e.clientY
    touchEndX.current = e.clientX
    touchEndY.current = e.clientY
    isSwiping.current = true
  }

  const handleMouseMove = (e) => {
    if (!isSwiping.current) return
    touchEndX.current = e.clientX
    touchEndY.current = e.clientY
  }

  const handleMouseUp = () => {
    if (!isSwiping.current) return
    isSwiping.current = false
    const diffX = touchStartX.current - touchEndX.current
    const diffY = touchStartY.current - touchEndY.current
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        handleNextImage()
      } else {
        handlePrevImage()
      }
    }
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    setActiveImageIndex(0)
    setShowAllReviews(false)
    setShowNavbar(true)
    lastScrollY.current = 0
  }, [productIdOrSlug])

  // Combined scroll handler: Scroll-spy + Smart auto-hide top Navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = Math.max(0, window.scrollY)

      // 1. Auto-hide Navbar on scroll down, reappear on scroll up
      if (currentScrollY <= 30) {
        setShowNavbar(true)
      } else if (currentScrollY > lastScrollY.current + 8) {
        // Scrolling DOWN -> hide top bar
        setShowNavbar(false)
      } else if (currentScrollY < lastScrollY.current - 8) {
        // Scrolling UP -> reveal top bar
        setShowNavbar(true)
      }
      lastScrollY.current = currentScrollY

      // 2. Active sticky tab Scroll-Spy
      const scrollPos = currentScrollY + 140
      const revTop = reviewsSectionRef.current?.offsetTop || Infinity
      const descTop = descSectionRef.current?.offsetTop || Infinity

      if (scrollPos >= revTop) {
        setActiveTab('reviews')
      } else if (scrollPos >= descTop) {
        setActiveTab('description')
      } else {
        setActiveTab('image')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!product || product.isHidden) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col justify-between">
        <Navbar />
        <div className="mx-auto max-w-xl text-center px-4 py-36">
          <h1 className="font-heading text-4xl font-bold text-[#1C1917]">Product Unavailable</h1>
          <p className="mt-3 text-[#78716C]">
            {product?.isHidden
              ? 'This product is currently hidden from the public catalog.'
              : 'The requested electronic hardware product could not be located.'}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-6 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-widest bg-[#991B33] text-white hover:bg-[#7E1227] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Export Catalog
          </Link>
        </div>
        <Footer />
        <CartDrawer />
        <WishlistDrawer />
      </div>
    )
  }

  const isOutOfStock = product.inStock === false

  const handleAddToCart = () => {
    if (isOutOfStock) return
    addItem(product)
    openCart()
  }

  const scrollToSection = (section) => {
    setActiveTab(section)
    if (section === 'image') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (section === 'description') {
      descSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
    } else if (section === 'reviews') {
      reviewsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.fullName,
        text: `Check out ${product.fullName} on Scope Internationals`,
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  const relatedProducts = allProducts.filter(
    (p) => p.genre === product.genre && p.id !== product.id && !p.isHidden
  ).slice(0, 4)

  const genreData = GENRES.find((g) => g.id === product.genre)

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] selection:bg-[#991B33] selection:text-white pb-20 sm:pb-0">
      <Navbar visible={showNavbar} />

      {/* Amazon-style Sticky Sub-Header Tabs (Image, Description, Reviews) */}
      <div
        className={`sticky z-40 border-b border-[#E7E2D9] bg-white/95 backdrop-blur-md transition-all duration-300 ease-out ${
          showNavbar ? 'top-16 sm:top-18' : 'top-0 shadow-md shadow-stone-900/5'
        }`}
      >
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
            {/* Nav Tabs */}
            <div className="flex items-center gap-1 sm:gap-4 py-2 flex-shrink-0">
              {[
                { id: 'image', label: 'Image' },
                { id: 'description', label: 'Specifications & Description' },
                { id: 'reviews', label: `Reviews (${product.reviewCount})` },
              ].map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => scrollToSection(tab.id)}
                    className={`relative px-2.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-300 ${
                      isActive
                        ? 'text-[#991B33]'
                        : 'text-[#78716C] hover:text-[#1C1917]'
                    }`}
                  >
                    <span className="whitespace-nowrap">{tab.label}</span>
                    {isActive && (
                      <span className="absolute inset-x-2 bottom-0 h-0.5 bg-[#991B33]" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Quick Back link */}
            <Link
              to={genreData ? `/${genreData.slug}` : '/'}
              className="text-xs text-[#78716C] hover:text-[#991B33] transition-colors flex items-center gap-1 whitespace-nowrap flex-shrink-0 pl-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Back to</span> {genreData ? genreData.label : 'Export Catalog'}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Product Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-[#78716C] mb-6">
          <Link to="/" className="hover:text-[#991B33] transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          {genreData && (
            <>
              <Link to={`/${genreData.slug}`} className="hover:text-[#991B33] transition-colors">
                {genreData.label}
              </Link>
              <ChevronRight className="h-3 w-3" />
            </>
          )}
          <span className="text-[#1C1917] font-medium truncate max-w-[200px] sm:max-w-none">{product.fullName}</span>
        </div>

        {/* Top Product Section: Image Gallery (Left) + Purchase Details (Right) */}
        <div ref={imageSectionRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Vertical Thumbnails */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 scrollbar-none">
              {product.gallery.map((imgUrl, index) => {
                const isSelected = activeImageIndex === index
                return (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 bg-white ${
                      isSelected
                        ? 'border-[#991B33] shadow-md shadow-[#991B33]/20 scale-105'
                        : 'border-[#E7E2D9] hover:border-[#991B33]/50 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.name} view ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                )
              })}
            </div>

            {/* Main Image Display Carousel */}
            <div
              className="relative flex-1 aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden border border-[#E7E2D9] bg-white shadow-xl shadow-stone-900/5 group touch-pan-y select-none cursor-grab active:cursor-grabbing"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Sliding Image Track */}
              <div
                className="flex h-full w-full transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${activeImageIndex * 100}%)` }}
              >
                {product.gallery.map((imgUrl, index) => (
                  <div key={index} className="min-w-full h-full flex-shrink-0 relative">
                    <img
                      src={imgUrl}
                      alt={`${product.fullName} view ${index + 1}`}
                      className="h-full w-full object-cover select-none pointer-events-none"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>

              {/* Prev / Next Arrows */}
              {product.gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePrevImage()
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 border border-[#E7E2D9] text-[#1C1917] hover:text-[#991B33] hover:bg-white backdrop-blur-sm transition-all shadow-md active:scale-95"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleNextImage()
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 border border-[#E7E2D9] text-[#1C1917] hover:text-[#991B33] hover:bg-white backdrop-blur-sm transition-all shadow-md active:scale-95"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}

              {/* Floating Actions (Share & Wishlist) */}
              <div
                className="absolute top-4 right-4 flex flex-col gap-2 z-10"
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleShare()
                  }}
                  className="p-2.5 rounded-full bg-white/80 border border-[#E7E2D9] text-[#78716C] hover:text-[#991B33] hover:bg-white backdrop-blur-sm transition-all shadow-xs"
                  title="Share product"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleWishlist(product)
                  }}
                  className={`p-2.5 rounded-full backdrop-blur-sm transition-all duration-300 shadow-xs ${
                    isWishlisted
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : 'bg-white/80 border border-[#E7E2D9] text-[#78716C] hover:text-rose-500 hover:bg-white'
                  }`}
                  title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  <Heart
                    className={`h-4 w-4 transition-transform duration-300 ${
                      isWishlisted ? 'fill-rose-500 text-rose-500 scale-110' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Share confirmation toast */}
              {isCopied && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 rounded-full bg-[#1C1917] px-4 py-1.5 text-xs font-bold text-white shadow-lg z-20">
                  Link copied to clipboard!
                </div>
              )}

              {/* Gallery Image Indicator Dots */}
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/60 backdrop-blur-sm border border-white/20 z-10"
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                {product.gallery.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveImageIndex(i)
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeImageIndex === i ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white'
                    }`}
                    aria-label={`View image ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Product Details & Purchase Box */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Product Full Name Title */}
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1C1917] leading-tight">
                {product.fullName}
              </h1>

              {/* Ratings and Reviews Bar */}
              <div
                onClick={() => scrollToSection('reviews')}
                className="mt-3 inline-flex items-center gap-2.5 cursor-pointer group/rate"
              >
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : i < product.rating
                          ? 'fill-amber-400/50 text-amber-400'
                          : 'text-stone-300 fill-stone-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-[#1C1917]">
                  {product.rating}
                </span>
                <span className="text-xs text-[#78716C] underline decoration-[#991B33]/40 group-hover/rate:text-[#991B33] transition-colors">
                  {product.reviewCount} verified importer reviews
                </span>
              </div>

              {/* Pricing Section */}
              <div className="mt-6 p-4 rounded-2xl border border-[#E7E2D9] bg-white shadow-xs">
                <div className="flex items-baseline gap-2.5 sm:gap-3 flex-nowrap">
                  <span className="font-heading text-3xl sm:text-4xl font-extrabold text-[#991B33]">
                    ₹{product.price}
                  </span>
                  <span className="text-sm sm:text-base text-[#78716C]/60 line-through">
                    M.R.P.: ₹{product.originalPrice}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {product.discountBadge || `-${product.discountPercent}%`}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-[#78716C]">
                  All prices benchmarked in INR. Standard Logistics & Handling: ₹60.
                </p>

                {/* Stock status */}
                {!isOutOfStock ? (
                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>In Stock · Factory Dispatched within 24 Hours</span>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-rose-600">
                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                    <span>Currently In Backorder · Contact export desk</span>
                  </div>
                )}
              </div>

              {/* Key Features Bullet List */}
              <div className="mt-6 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#991B33]">
                  Key Technical Specifications
                </h4>
                <ul className="space-y-2 text-sm text-[#44403C]">
                  {product.specs ? (
                    Object.entries(product.specs).map(([label, val]) => (
                      <li key={label} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#991B33] flex-shrink-0 mt-0.5" />
                        <span><strong className="text-[#1C1917]">{label}:</strong> {val}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#991B33] flex-shrink-0 mt-0.5" />
                        <span>High-performance electronic components & precision engineering</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#991B33] flex-shrink-0 mt-0.5" />
                        <span>Certifications: CE, FCC, RoHS, ISO9001 Tested</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#991B33] flex-shrink-0 mt-0.5" />
                        <span>Reinforced packaging designed for global transit safety</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Desktop Add to Cart Button */}
            <div className="mt-8 pt-6 border-t border-[#E7E2D9]">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full flex items-center justify-center gap-3 rounded-2xl py-3.5 sm:py-4 text-sm font-bold uppercase tracking-widest transition-all cursor-pointer ${
                  isOutOfStock
                    ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                    : 'bg-[#991B33] text-white hover:bg-[#7E1227] shadow-lg shadow-[#991B33]/20 active:scale-98'
                }`}
              >
                <ShoppingBag className="h-5 w-5" />
                <span>{isOutOfStock ? 'Out of Stock' : 'Add to Export Order'}</span>
              </button>

              {/* Assurance Trust Badges */}
              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-white border border-[#E7E2D9] shadow-xs">
                  <Truck className="h-4 w-4 mx-auto text-[#991B33] mb-1" />
                  <span className="text-[10px] text-[#78716C] font-medium block">Express Cargo Logistics</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#E7E2D9] shadow-xs">
                  <ShieldCheck className="h-4 w-4 mx-auto text-[#991B33] mb-1" />
                  <span className="text-[10px] text-[#78716C] font-medium block">100% QC Certification</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#E7E2D9] shadow-xs">
                  <RotateCcw className="h-4 w-4 mx-auto text-[#991B33] mb-1" />
                  <span className="text-[10px] text-[#78716C] font-medium block">Warranty & Spares</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Dedicated Description Tab / Content */}
        <div ref={descSectionRef} className="mt-20 pt-10 border-t border-[#E7E2D9] scroll-mt-14 sm:scroll-mt-16">
          <div className="max-w-4xl">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1C1917]">
              Product Overview & Specifications
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#44403C]">
              {product.description}
            </p>

            {/* Full Specifications Table */}
            <div className="mt-8 rounded-2xl border border-[#E7E2D9] bg-white shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E7E2D9] bg-[#FAF8F5]">
                <h3 className="font-heading text-base font-bold text-[#1C1917]">
                  Export Engineering Specifications
                </h3>
              </div>
              <div className="divide-y divide-[#E7E2D9] text-sm">
                {product.specs ? (
                  Object.entries(product.specs).map(([label, val]) => (
                    <div key={label} className="grid grid-cols-3 px-6 py-3.5">
                      <span className="text-[#78716C] font-medium">{label}</span>
                      <span className="col-span-2 font-semibold text-[#1C1917]">{val}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="grid grid-cols-3 px-6 py-3.5">
                      <span className="text-[#78716C] font-medium">Category</span>
                      <span className="col-span-2 font-semibold text-[#1C1917]">{genreData ? genreData.label : product.genre}</span>
                    </div>
                    <div className="grid grid-cols-3 px-6 py-3.5">
                      <span className="text-[#78716C] font-medium">Compliance Standards</span>
                      <span className="col-span-2 font-semibold text-[#1C1917]">CE, FCC, RoHS, ISO9001 Tested</span>
                    </div>
                    <div className="grid grid-cols-3 px-6 py-3.5">
                      <span className="text-[#78716C] font-medium">QC Testing</span>
                      <span className="col-span-2 font-semibold text-[#1C1917]">100% Pre-Shipment Hardware Verification</span>
                    </div>
                  </>
                )}
                <div className="grid grid-cols-3 px-6 py-3.5">
                  <span className="text-[#78716C] font-medium">Standard Vertical</span>
                  <span className="col-span-2 font-semibold text-[#1C1917]">{genreData ? genreData.label : product.genre}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Customer Reviews */}
        <div ref={reviewsSectionRef} className="mt-20 pt-10 border-t border-[#E7E2D9] scroll-mt-14 sm:scroll-mt-16">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-10">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1C1917]">
                Buyer & Importer Feedback
              </h2>
              <p className="mt-1 text-sm text-[#78716C]">
                Verified distributor and procurement reviews on {product.fullName}
              </p>
            </div>

            {/* Overall Rating Box */}
            <div className="flex items-center gap-4 p-4 rounded-2xl border border-[#E7E2D9] bg-white shadow-xs">
              <div className="text-center">
                <span className="font-heading text-4xl font-extrabold text-[#991B33] block">
                  {product.rating}
                </span>
                <span className="text-[11px] text-[#78716C]">out of 5</span>
              </div>
              <div className="border-l border-[#E7E2D9] pl-4">
                <div className="flex items-center text-amber-500 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : i < product.rating
                          ? 'fill-amber-400/50 text-amber-400'
                          : 'text-stone-300 fill-stone-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-[#1C1917]">
                  {product.reviewCount} customer ratings
                </span>
              </div>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(showAllReviews ? product.reviews : product.reviews.slice(0, 3)).map((rev) => (
              <div
                key={rev.id}
                className="rounded-2xl border border-[#E7E2D9] bg-white p-5 shadow-xs transition-all hover:border-[#991B33]/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-[#FDF2F4] text-[#991B33] border border-[#F7CCD5] flex items-center justify-center font-bold text-xs">
                      {rev.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[#1C1917] block leading-snug">
                        {rev.name}
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 inline-flex items-center gap-1 font-medium">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Verified Importer
                      </span>
                    </div>
                  </div>

                  <span className="text-xs text-[#78716C]">
                    {rev.date}
                  </span>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 mt-3 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < rev.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-300 fill-stone-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="mt-2.5 text-sm text-[#44403C] leading-relaxed font-sans">
                  {rev.text}
                </p>
              </div>
            ))}
          </div>

          {/* View More Button */}
          {product.reviews && product.reviews.length > 3 && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setShowAllReviews((prev) => !prev)}
                className="group inline-flex items-center gap-2 rounded-full border border-[#991B33] bg-white px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#991B33] shadow-xs transition-all duration-300 hover:bg-[#991B33] hover:text-white active:scale-95 cursor-pointer"
              >
                <span>{showAllReviews ? 'Show Less' : 'View More Reviews'}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${
                    showAllReviews ? 'rotate-180' : 'group-hover:translate-y-0.5'
                  }`}
                />
              </button>
            </div>
          )}
        </div>

        {/* Section 4: Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-10 border-t border-[#E7E2D9]">
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#1C1917] mb-6">
              More from {genreData ? genreData.label : 'Export Vertical'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => navigate(`/product/${rel.slug}`)}
                  className="product-card group relative cursor-pointer overflow-hidden rounded-2xl border border-[#E7E2D9] bg-white p-3 shadow-xs transition-all hover:border-[#991B33]/50 hover:shadow-md"
                >
                  <div className="aspect-[4/5] rounded-xl overflow-hidden bg-[#FAF8F5] mb-3">
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h4 className="font-heading text-sm font-bold text-[#1C1917] group-hover:text-[#991B33] transition-colors line-clamp-1">
                    {rel.name}
                  </h4>
                  <div className="mt-1 flex items-baseline gap-1.5 flex-nowrap">
                    <span className="font-heading text-sm font-bold text-[#991B33] shrink-0">
                      ₹{rel.price}
                    </span>
                    <span className="text-[11px] text-[#78716C]/60 line-through shrink-0">
                      ₹{rel.originalPrice}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded shrink-0 border border-emerald-200">
                      {rel.discountBadge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom "Add to Cart" Bar for Mobile */}
      <div className="fixed bottom-0 inset-x-0 z-50 sm:hidden border-t border-[#E7E2D9] bg-white/95 backdrop-blur-xl px-4 py-3 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1.5 flex-nowrap">
              <span className="font-heading text-xl font-extrabold text-[#991B33]">
                ₹{product.price}
              </span>
              <span className="text-xs text-[#78716C]/60 line-through">
                ₹{product.originalPrice}
              </span>
              <span className="text-xs font-bold text-emerald-700">
                {product.discountBadge}
              </span>
            </div>
            <span className={`text-[10px] font-semibold block ${isOutOfStock ? 'text-rose-600' : 'text-emerald-700'}`}>
              {isOutOfStock ? 'Currently In Backorder' : 'In Stock · Ready to Dispatch'}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold uppercase tracking-wider cursor-pointer ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                : 'bg-[#991B33] text-white shadow-md'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>{isOutOfStock ? 'Out of Stock' : 'Add to Order'}</span>
          </button>
        </div>
      </div>

      <Footer />
      <CartDrawer />
      <WishlistDrawer />
    </div>
  )
}
