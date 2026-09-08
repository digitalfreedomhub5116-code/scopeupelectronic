import { ShoppingBag, Star, Heart, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

const PRODUCTS_PER_BATCH = 8

function ProductCard({ product }) {
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const openReviews = useCartStore((s) => s.openReviews)
  const toggleWishlist = useCartStore((s) => s.toggleWishlist)
  const isWishlisted = useCartStore((s) => s.isWishlisted(product.id))
  const [ref, isVisible] = useScrollReveal(0.05)
  const isOutOfStock = product.inStock === false

  const handleCardClick = () => {
    navigate(`/product/${product.slug}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAdd = (e) => {
    e.stopPropagation()
    if (isOutOfStock) return
    addItem(product)
    openCart()
  }

  const handleWishlistClick = (e) => {
    e.stopPropagation()
    toggleWishlist(product)
  }

  return (
    <div
      ref={ref}
      onClick={handleCardClick}
      className={`product-card group relative cursor-pointer overflow-hidden rounded-2xl border border-[#E7E2D9] bg-white transition-all duration-500 hover:border-[#991B33]/40 hover:shadow-xl hover:shadow-stone-900/8 flex flex-col ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {/* Product Image & Wishlist Button */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
        <img
          src={product.image}
          alt={product.name}
          className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 ${
            isOutOfStock ? 'opacity-60 grayscale-[25%]' : ''
          }`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-40" />



        {/* Out of Stock badge */}
        {isOutOfStock && (
          <div className="absolute bottom-2.5 left-2.5 z-10">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-black/85 backdrop-blur-md text-rose-400 border border-rose-500/50 shadow-md">
              Out of Stock
            </span>
          </div>
        )}

        {/* Top-Right Wishlist Heart Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2.5 right-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 shadow-xs ${
            isWishlisted
              ? 'bg-rose-50 text-[#991B33] border border-rose-200'
              : 'bg-white/85 text-stone-500 hover:text-[#991B33] hover:bg-white border border-stone-200'
          }`}
          aria-label={`Wishlist ${product.name}`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart
            className={`h-3.5 w-3.5 transition-all duration-300 ${
              isWishlisted ? 'fill-[#991B33] text-[#991B33] scale-110 animate-heart-burst' : 'hover:scale-110'
            }`}
            strokeWidth={2}
          />
        </button>
      </div>

      {/* Product Details — Compact */}
      <div className="px-2.5 py-2 sm:px-3 sm:py-2.5 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Title */}
          <h3 className="font-serif text-xs sm:text-sm font-bold text-[#1C1917] transition-colors group-hover:text-[#991B33] line-clamp-1">
            {product.shortName || product.name}
          </h3>

          {/* Star Rating */}
          <div
            onClick={(e) => {
              e.stopPropagation()
              openReviews(product)
            }}
            className="mt-1 flex items-center gap-1 cursor-pointer group/rating hover:opacity-90 transition-opacity"
            title="Click to view verified buyer reviews"
          >
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-2.5 w-2.5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-amber-500 text-amber-500'
                      : i < product.rating
                      ? 'fill-amber-500/50 text-amber-500'
                      : 'text-stone-300 fill-stone-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-[#1C1917]">
              {product.rating}
            </span>
            <span className="text-[9px] sm:text-[10px] text-[#78716C] group-hover/rating:text-[#991B33] transition-colors">
              ({product.reviewCount})
            </span>
          </div>

          {/* Pricing */}
          <div className="mt-1 flex items-baseline gap-1.5 flex-nowrap overflow-hidden">
            <span className="font-serif text-sm sm:text-base font-bold text-[#991B33] shrink-0">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-[#A8A29E] line-through shrink-0">
              ₹{product.originalPrice?.toLocaleString('en-IN')}
            </span>
            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1 py-0.5 rounded shrink-0">
              {product.discountBadge || `-${product.discountPercent}%`}
            </span>
          </div>
        </div>

        {/* Add to Bag Button */}
        <div className="mt-1.5 pt-1.5 border-t border-[#F0EBE3]">
          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`flex w-full items-center justify-center gap-1.5 rounded-xl py-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                : 'bg-[#991B33] hover:bg-[#7E1227] text-white shadow-xs hover:shadow-md hover:shadow-[#991B33]/20 active:scale-98 cursor-pointer'
            }`}
            aria-label={isOutOfStock ? `${product.name} is out of stock` : `Add ${product.name} to bag`}
          >
            <ShoppingBag className="h-3 w-3" />
            <span>{isOutOfStock ? 'Out of Stock' : 'Add to Bag'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProductGrid() {
  const allProducts = useCartStore((s) => s.products)
  const catalog = useMemo(() => allProducts.filter((p) => !p.isHidden), [allProducts])
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_BATCH)
  const loadMoreRef = useRef(null)

  const visibleProducts = catalog.slice(0, visibleCount)
  const hasMore = visibleCount < catalog.length

  // Infinite scroll trigger
  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + PRODUCTS_PER_BATCH, catalog.length))
  }, [catalog.length])

  useEffect(() => {
    const el = loadMoreRef.current
    if (!el || !hasMore) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore()
        }
      },
      { threshold: 0.1, rootMargin: '250px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, loadMore])

  return (
    <section id="products" className="relative pb-16 sm:pb-24 pt-8 sm:pt-12 bg-[#FAF8F5]">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1917] tracking-tight">
            Flagship Electronics Collection
          </h2>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Infinite Scroll Sentinel */}
        {hasMore && (
          <div ref={loadMoreRef} className="mt-14 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#991B33] animate-pulse" />
              <div className="h-2 w-2 rounded-full bg-[#991B33] animate-pulse [animation-delay:200ms]" />
              <div className="h-2 w-2 rounded-full bg-[#991B33] animate-pulse [animation-delay:400ms]" />
            </div>
            <p className="text-xs text-[#78716C] tracking-wider uppercase font-semibold">Loading more products...</p>
          </div>
        )}

        {/* End of Catalog message */}
        {!hasMore && (
          <div className="mt-16 flex flex-col items-center gap-2 text-center">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#991B33]/40 to-transparent" />
            <p className="mt-2 text-xs text-[#78716C] tracking-wider uppercase font-semibold">
              All {catalog.length} flagship models displayed
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
