import { Star, X, CheckCircle2, ChevronDown } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useState, useEffect } from 'react'

export default function ReviewsModal() {
  const activeProduct = useCartStore((s) => s.activeReviewProduct)
  const closeReviews = useCartStore((s) => s.closeReviews)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    setShowAll(false)
  }, [activeProduct])

  useEffect(() => {
    if (activeProduct) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [activeProduct])

  if (!activeProduct) return null

  const reviews = activeProduct.reviews || []
  const visibleReviews = showAll ? reviews : reviews.slice(0, 3)

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={closeReviews}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-xl max-h-[85vh] flex flex-col rounded-2xl border border-[#E7E2D9] bg-white shadow-2xl shadow-stone-900/20 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E7E2D9] px-6 py-4 bg-[#FAF8F5]">
          <div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-[#1C1917]">
              {activeProduct.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Math.floor(activeProduct.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : i < activeProduct.rating
                        ? 'fill-amber-400/50 text-amber-400'
                        : 'text-stone-300 fill-stone-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-[#1C1917]">
                {activeProduct.rating}
              </span>
              <span className="text-xs text-[#78716C]">
                ({activeProduct.reviewCount} customer reviews)
              </span>
            </div>
          </div>

          <button
            onClick={closeReviews}
            className="rounded-full p-2 text-[#78716C] transition-colors hover:bg-[#F0EBE3] hover:text-[#1C1917]"
            aria-label="Close reviews"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Reviews List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {visibleReviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-xl border border-[#E7E2D9] bg-[#FAF8F5] p-4 transition-all hover:border-[#991B33]/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#1C1917]">
                    {rev.name}
                  </span>
                  {rev.verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      Verified Buyer
                    </span>
                  )}
                </div>

                <span className="text-[11px] text-[#78716C]">
                  {rev.date}
                </span>
              </div>

              {/* Review Stars */}
              <div className="flex items-center gap-1 mt-1.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < rev.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-300 fill-stone-200'
                    }`}
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="mt-2 text-xs sm:text-sm text-[#44403C] leading-relaxed font-sans">
                {rev.text}
              </p>
            </div>
          ))}

          {/* View More Button */}
          {reviews.length > 3 && (
            <div className="pt-2 flex justify-center">
              <button
                onClick={() => setShowAll((prev) => !prev)}
                className="group inline-flex items-center gap-2 rounded-full border border-[#991B33] bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#991B33] transition-all duration-300 hover:bg-[#991B33] hover:text-white active:scale-95 cursor-pointer"
              >
                <span>{showAll ? 'Show Less' : 'View More'}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-300 ${
                    showAll ? 'rotate-180' : 'group-hover:translate-y-0.5'
                  }`}
                />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#E7E2D9] px-6 py-3 bg-[#FAF8F5] text-center">
          <p className="text-[11px] text-[#78716C]">
            {showAll
              ? `Showing all ${reviews.length} verified procurement reviews`
              : `Showing 3 of ${reviews.length} verified procurement reviews`}
          </p>
        </div>
      </div>
    </div>
  )
}
