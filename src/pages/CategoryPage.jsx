import { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ShoppingBag, Star, Heart, Sparkles } from 'lucide-react'
import { GENRES, MOCK_PRODUCTS, useCartStore } from '../store/cartStore'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CartDrawer from '../components/CartDrawer'
import ReviewsModal from '../components/ReviewsModal'
import WishlistDrawer from '../components/WishlistDrawer'


function ProductCard({ product }) {
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const openReviews = useCartStore((s) => s.openReviews)
  const toggleWishlist = useCartStore((s) => s.toggleWishlist)
  const isWishlisted = useCartStore((s) => s.isWishlisted(product.id))
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
      onClick={handleCardClick}
      className="product-card group relative cursor-pointer overflow-hidden rounded-2xl border border-[#E7E2D9] bg-white transition-all duration-300 hover:border-[#991B33]/40 hover:shadow-lg hover:shadow-stone-900/5 flex flex-col"
    >
      {/* Product Image & Wishlist Button */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#FAF8F5]">
        <img
          src={product.image}
          alt={product.name}
          className={`h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
            isOutOfStock ? 'opacity-70 grayscale-[25%]' : ''
          }`}
          loading="lazy"
        />

        {/* Out of Stock badge on image */}
        {isOutOfStock && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-stone-900/85 backdrop-blur-md text-rose-300 border border-rose-500/40 shadow-sm">
              In Backorder
            </span>
          </div>
        )}

        {/* Top-Right Wishlist Heart Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-xs'
              : 'bg-white/85 text-[#78716C] hover:text-rose-500 hover:bg-white border border-[#E7E2D9]'
          }`}
          aria-label={`Wishlist ${product.name}`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart
            className={`h-4 w-4 transition-all duration-300 ${
              isWishlisted ? 'fill-rose-500 text-rose-500 scale-110' : 'hover:scale-110'
            }`}
            strokeWidth={1.8}
          />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* 1. Product Name Title */}
          <h3 className="font-heading text-sm sm:text-base font-bold text-[#1C1917] transition-colors group-hover:text-[#991B33] line-clamp-1">
            {product.name}
          </h3>

          {/* 2. Star Rating */}
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
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : i < product.rating
                      ? 'fill-amber-400/50 text-amber-400'
                      : 'text-stone-300 fill-stone-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-[#1C1917]">
              {product.rating}
            </span>
            <span className="text-[11px] text-[#78716C] group-hover/rating:text-[#991B33] transition-colors">
              ({product.reviewCount})
            </span>
          </div>

          {/* 3. Offer Price & MRP */}
          <div className="mt-2 flex items-baseline gap-1.5 flex-nowrap overflow-hidden">
            <span className="font-heading text-base font-bold text-[#991B33] shrink-0">
              ₹{product.price}
            </span>
            <span className="text-xs text-[#78716C]/60 line-through shrink-0">
              ₹{product.originalPrice || 459}
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 shrink-0">
              {product.discountBadge || `-${product.discountPercent}%`}
            </span>
          </div>
        </div>

        {/* 4. Add to Bag Button */}
        <div className="mt-3 pt-3 border-t border-[#E7E2D9]">
          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                : 'bg-[#991B33] text-white hover:bg-[#7E1227] shadow-xs active:scale-98'
            }`}
            aria-label={isOutOfStock ? `${product.name} is out of stock` : `Add ${product.name} to bag`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>{isOutOfStock ? 'Out of Stock' : 'Add to Bag'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CategoryPage() {
  const { genreSlug } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [genreSlug])

  const genre = GENRES.find((g) => g.slug === genreSlug)
  const allProducts = useCartStore((s) => s.products)
  const products = genre ? allProducts.filter((p) => p.genre === genre.id && !p.isHidden) : []

  if (!genre) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col justify-between">
        <Navbar />
        <div className="mx-auto max-w-xl text-center px-4 py-32">
          <h1 className="font-heading text-4xl font-bold text-[#1C1917]">Category Not Found</h1>
          <p className="mt-3 text-[#78716C]">The requested tech collection does not exist.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-6 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-widest bg-[#991B33] text-white hover:bg-[#7E1227] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Catalog
          </Link>
        </div>
        <Footer />
        <CartDrawer />
      </div>
    )
  }

  const otherGenres = GENRES.filter((g) => g.id !== genre.id)

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917]">
      <Navbar />

      {/* Category Hero Banner */}
      <section className="relative min-h-[340px] sm:min-h-[400px] flex items-end overflow-hidden pt-24 pb-12 sm:pb-16 border-b border-[#E7E2D9]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={genre.image}
            alt={genre.label}
            className="h-full w-full object-cover filter brightness-90 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/85 to-[#FAF8F5]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5]/90 via-[#FAF8F5]/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          {/* Back to Home Button */}
          <Link
            to="/"
            className="group mb-6 inline-flex items-center gap-2 rounded-full border border-[#E7E2D9] bg-white/90 px-4 py-2 text-xs font-semibold text-[#1C1917] backdrop-blur-sm transition-all hover:border-[#991B33] hover:text-[#991B33] shadow-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            <span>All Tech Collections</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl font-extrabold tracking-tight text-[#1C1917] sm:text-5xl lg:text-6xl">
                {genre.label} Collection
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#44403C] sm:text-base">
                Certified {genre.label.toLowerCase()} devices, audiophile components, and flagship consumer technology.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E7E2D9] bg-white/95 px-5 py-3 shadow-xs self-start sm:self-end">
              <span className="text-xs text-[#78716C] block">
                {products.length > 0 ? 'Models Available' : 'Collection Status'}
              </span>
              <span className="font-heading text-lg font-bold text-[#991B33] flex items-center gap-1.5">
                {products.length > 0 ? (
                  `${products.length} Products`
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-[#991B33] animate-pulse" />
                    <span>In Catalog Pipeline</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="relative py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {products.length > 0 ? (
            /* Products Grid */
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* Coming Soon Showcase */
            <div className="my-8 mx-auto max-w-2xl rounded-3xl border border-[#E7E2D9] bg-white p-8 sm:p-14 text-center shadow-md relative overflow-hidden">
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#1C1917] leading-tight">
                Expanding {genre.label} Collection
              </h2>
              <p className="mt-4 max-w-lg mx-auto text-base sm:text-lg leading-relaxed text-[#44403C]">
                We are curating new flagship <span className="text-[#991B33] font-semibold">{genre.label}</span> innovations for this collection.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-widest bg-[#991B33] text-white hover:bg-[#7E1227] shadow-sm transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Browse All Products</span>
                </Link>
                {otherGenres.length > 0 && (
                  <button
                    onClick={() => {
                      const el = document.getElementById('explore-other-genres')
                      if (el) el.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-[#E7E2D9] bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#1C1917] hover:border-[#991B33] hover:text-[#991B33] transition-colors"
                  >
                    <span>Other Categories</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Other Verticals Switcher */}
          <div id="explore-other-genres" className="mt-20 pt-10 border-t border-[#E7E2D9]">
            <h3 className="font-heading text-xl font-bold text-[#1C1917] mb-4">
              Explore Other Categories
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {otherGenres.map((og) => {
                const ogCount = allProducts.filter((p) => p.genre === og.id && !p.isHidden).length
                return (
                  <button
                    key={og.id}
                    onClick={() => {
                      navigate(`/${og.slug}`)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className="group relative overflow-hidden rounded-2xl border border-[#E7E2D9] bg-white p-4 text-left transition-all duration-300 hover:border-[#991B33]/40 hover:shadow-md flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <span className="font-heading text-base sm:text-lg font-bold text-[#1C1917] group-hover:text-[#991B33] transition-colors block">
                        {og.label}
                      </span>
                      <span className="text-[11px] text-[#78716C]">
                        {ogCount > 0 ? `${ogCount} Products` : 'Pipeline'}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#78716C] group-hover:text-[#991B33] group-hover:translate-x-1 transition-all" />
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <CartDrawer />
      <ReviewsModal />
      <WishlistDrawer />
    </div>
  )
}
