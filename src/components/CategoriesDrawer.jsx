import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ArrowRight, Sparkles, ChevronRight, Tag } from 'lucide-react'
import { GENRES, useCartStore } from '../store/cartStore'

export default function CategoriesDrawer() {
  const isOpen = useCartStore((s) => s.isCategoriesOpen)
  const closeCategories = useCartStore((s) => s.closeCategories)
  const allProducts = useCartStore((s) => s.products)
  const navigate = useNavigate()

  const [selectedGenreId, setSelectedGenreId] = useState(GENRES[0]?.id || 'JEWELLERY')

  if (!isOpen) return null

  const selectedGenre = GENRES.find((g) => g.id === selectedGenreId) || GENRES[0]
  const genreProducts = allProducts.filter((p) => p.genre === selectedGenre.id && !p.isHidden)

  const handleNavigate = (slug) => {
    closeCategories()
    navigate(`/${slug}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleProductClick = (slug) => {
    closeCategories()
    navigate(`/product/${slug}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col md:hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeCategories}
      />

      {/* Full-Screen App Modal Content */}
      <div className="relative mt-12 flex-1 rounded-t-3xl bg-[#FAF8F5] shadow-2xl flex flex-col overflow-hidden animate-slide-up">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#E7E2D9] bg-white px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span className="font-heading text-lg font-bold text-[#1C1917]">
              Explore Categories
            </span>
            <span className="rounded-full bg-[#991B33]/10 px-2 py-0.5 text-[10px] font-bold text-[#991B33]">
              {GENRES.length} Collections
            </span>
          </div>
          <button
            onClick={closeCategories}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-[#78716C] hover:bg-stone-200 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Split-Pane Category Browser (Myntra App Pattern) */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Column: Vertical Category List */}
          <div className="w-[36%] border-r border-[#E7E2D9] bg-white overflow-y-auto no-scrollbar py-2">
            {GENRES.map((genre) => {
              const isSelected = genre.id === selectedGenreId
              return (
                <button
                  key={genre.id}
                  onClick={() => setSelectedGenreId(genre.id)}
                  className={`relative flex w-full flex-col items-center px-2 py-3.5 transition-all text-center ${
                    isSelected
                      ? 'bg-[#FAF8F5] text-[#991B33] font-bold'
                      : 'text-[#78716C] hover:bg-stone-50'
                  }`}
                >
                  {/* Category Thumbnail */}
                  <div
                    className={`h-11 w-11 rounded-full overflow-hidden border-2 p-0.5 transition-all ${
                      isSelected
                        ? 'border-[#991B33] ring-2 ring-[#991B33]/20 scale-105'
                        : 'border-transparent'
                    }`}
                  >
                    <img
                      src={genre.image}
                      alt={genre.label}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>

                  <span className="mt-1.5 text-[11px] leading-tight line-clamp-2 px-1">
                    {genre.label}
                  </span>

                  {/* Active Indicator Bar on Left */}
                  {isSelected && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-[#991B33]" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Right Column: Selected Category Showcase */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#FAF8F5] flex flex-col justify-between">
            <div>
              {/* Category Feature Hero Card */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-[#E7E2D9] shadow-xs group">
                <img
                  src={selectedGenre.image}
                  alt={selectedGenre.label}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Featured Collection
                  </span>
                  <h3 className="font-heading text-base font-bold leading-tight mt-0.5">
                    {selectedGenre.label}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p className="mt-2.5 text-[11px] text-[#78716C] leading-relaxed line-clamp-2">
                {selectedGenre.description}
              </p>

              {/* Quick Products Mini Grid */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#1C1917] tracking-wider uppercase">
                    Popular In {selectedGenre.label.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-[#78716C]">
                    {genreProducts.length} items
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {genreProducts.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleProductClick(p.slug)}
                      className="rounded-xl border border-[#E7E2D9] bg-white p-2 shadow-xs cursor-pointer active:scale-95 transition-transform"
                    >
                      <div className="aspect-square w-full rounded-lg overflow-hidden bg-stone-100">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <h4 className="mt-1.5 text-[11px] font-bold text-[#1C1917] line-clamp-1">
                        {p.shortName || p.name}
                      </h4>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-xs font-bold text-[#991B33]">
                          ₹{p.price}
                        </span>
                        {p.originalPrice && (
                          <span className="text-[9px] text-[#78716C]/60 line-through">
                            ₹{p.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* View Full Collection Button */}
            <button
              onClick={() => handleNavigate(selectedGenre.slug)}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#991B33] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md active:scale-98 cursor-pointer"
            >
              <span>Explore All {selectedGenre.label}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
