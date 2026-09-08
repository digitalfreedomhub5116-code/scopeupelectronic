import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function WishlistDrawer() {
  const isWishlistOpen = useCartStore((s) => s.isWishlistOpen)
  const closeWishlist = useCartStore((s) => s.closeWishlist)
  const wishlist = useCartStore((s) => s.wishlist)
  const toggleWishlist = useCartStore((s) => s.toggleWishlist)
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const navigate = useNavigate()

  const [animating, setAnimating] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isWishlistOpen) {
      setVisible(true)
      requestAnimationFrame(() => setAnimating(true))
      document.body.style.overflow = 'hidden'
    } else {
      setAnimating(false)
      const timer = setTimeout(() => setVisible(false), 350)
      document.body.style.overflow = ''
      return () => clearTimeout(timer)
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isWishlistOpen])

  if (!visible) return null

  const handleMoveToCart = (product) => {
    if (product.inStock === false) return
    addItem(product)
    toggleWishlist(product)
    closeWishlist()
    openCart()
  }

  const handleProductClick = (slug) => {
    closeWishlist()
    navigate(`/product/${slug}`)
  }

  return (
    <div className="fixed inset-0 z-[110]">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity duration-300 ${
          animating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeWishlist}
      />

      {/* Drawer */}
      <div
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl shadow-stone-900/20 border-l border-[#E7E2D9] transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          animating ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E7E2D9] px-5 py-4 bg-[#FAF8F5]">
          <div className="flex items-center gap-2.5">
            <Heart className="h-5 w-5 text-[#991B33] fill-[#991B33]" />
            <h2 className="font-heading text-lg font-bold text-[#1C1917]">Your Saved Items</h2>
            {wishlist.length > 0 && (
              <span className="rounded-full bg-[#FDF2F4] border border-[#F7CCD5] px-2.5 py-0.5 text-xs font-bold text-[#991B33]">
                {wishlist.length}
              </span>
            )}
          </div>
          <button
            onClick={closeWishlist}
            className="rounded-full p-2 text-[#78716C] transition-colors hover:bg-[#F0EBE3] hover:text-[#1C1917]"
            aria-label="Close wishlist"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Wishlist Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {wishlist.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF8F5] border border-[#E7E2D9] mb-4">
                <Heart className="h-8 w-8 text-[#D6D0C5]" />
              </div>
              <p className="font-heading text-lg font-bold text-[#1C1917]">
                Your wishlist is empty
              </p>
              <p className="mt-1 max-w-xs text-xs text-[#78716C] leading-relaxed">
                Tap the heart on any product card to bookmark certified electronics for bulk procurement.
              </p>
              <button
                onClick={closeWishlist}
                className="mt-6 rounded-full border border-[#991B33] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#991B33] transition-all hover:bg-[#991B33] hover:text-white"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 rounded-xl border border-[#E7E2D9] bg-[#FAF8F5] p-3 transition-all hover:border-[#991B33]/30"
                >
                  {/* Thumbnail */}
                  <div
                    onClick={() => handleProductClick(item.slug)}
                    className="h-20 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border border-[#E7E2D9] bg-white"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  {/* Info & Actions */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4
                          onClick={() => handleProductClick(item.slug)}
                          className="font-heading text-sm font-bold text-[#1C1917] hover:text-[#991B33] cursor-pointer transition-colors line-clamp-1"
                        >
                          {item.fullName || item.name}
                        </h4>
                        <button
                          onClick={() => toggleWishlist(item)}
                          className="ml-2 rounded-full p-1 text-[#78716C] transition-colors hover:text-rose-500"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="mt-1 flex items-baseline gap-1.5 flex-nowrap">
                        <span className="font-heading text-sm font-bold text-[#991B33]">
                          ₹{item.price}
                        </span>
                        <span className="text-[11px] text-[#78716C]/60 line-through">
                          ₹{item.originalPrice || 459}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          {item.discountBadge}
                        </span>
                      </div>
                    </div>

                    {/* Move to Cart CTA */}
                    <button
                      onClick={() => handleMoveToCart(item)}
                      disabled={item.inStock === false}
                      className={`mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                        item.inStock === false
                          ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                          : 'bg-[#991B33] text-white hover:bg-[#7E1227] shadow-xs cursor-pointer'
                      }`}
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      <span>{item.inStock === false ? 'Out of Stock' : 'Add to Export Order'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlist.length > 0 && (
          <div className="border-t border-[#E7E2D9] px-5 py-4 bg-[#FAF8F5]">
            <button
              onClick={() => {
                const inStockItems = wishlist.filter((p) => p.inStock !== false)
                inStockItems.forEach((p) => addItem(p))
                inStockItems.forEach((p) => toggleWishlist(p))
                closeWishlist()
                openCart()
              }}
              className="w-full rounded-full py-3 text-xs font-bold uppercase tracking-widest bg-[#991B33] text-white hover:bg-[#7E1227] shadow-sm transition-colors cursor-pointer"
            >
              Move All to Export Order
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
