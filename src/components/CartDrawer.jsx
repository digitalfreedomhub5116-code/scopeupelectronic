import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCartStore, GENRES } from '../store/cartStore'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CartItem({ item }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const genreData = GENRES.find((g) => g.id === item.genre)

  return (
    <div className="flex gap-3.5 rounded-xl border border-[#E7E2D9] bg-[#FAF8F5] p-3 transition-colors hover:border-[#991B33]/30">
      {/* Thumbnail */}
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-[#E7E2D9] bg-white">
        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between">
            <div>
              {genreData && (
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#991B33]">
                  {genreData.label}
                </span>
              )}
              <h4 className="font-heading text-sm font-semibold text-[#1C1917] leading-snug">
                {item.name}
              </h4>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="ml-2 rounded-full p-1 text-[#78716C] transition-colors hover:bg-[#F0EBE3] hover:text-[#1C1917]"
              aria-label="Remove item"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center gap-1 rounded-full border border-[#E7E2D9] bg-white px-2 py-0.5 shadow-xs">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="rounded-full p-1 text-[#78716C] transition-colors hover:text-[#991B33]"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="min-w-[1.25rem] text-center text-xs font-semibold text-[#1C1917]">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="rounded-full p-1 text-[#78716C] transition-colors hover:text-[#991B33]"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="font-heading text-sm font-bold text-[#991B33]">
              ₹{item.price * item.quantity}
            </span>
            <span className="text-[11px] text-[#78716C]/60 line-through">
              ₹{(item.originalPrice || 459) * item.quantity}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen)
  const closeCart = useCartStore((s) => s.closeCart)
  const items = useCartStore((s) => s.items)
  const getTotal = useCartStore((s) => s.getTotal)
  const getItemCount = useCartStore((s) => s.getItemCount)
  const navigate = useNavigate()
  const [animating, setAnimating] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setVisible(true)
      requestAnimationFrame(() => setAnimating(true))
      document.body.style.overflow = 'hidden'
    } else {
      setAnimating(false)
      const timer = setTimeout(() => setVisible(false), 350)
      document.body.style.overflow = ''
      return () => clearTimeout(timer)
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!visible) return null

  const total = getTotal()
  const count = getItemCount()
  const originalTotal = items.reduce(
    (sum, item) => sum + (item.originalPrice || 459) * item.quantity,
    0
  )
  const totalSavings = originalTotal - total

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity duration-300 ${
          animating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeCart}
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
            <ShoppingBag className="h-5 w-5 text-[#991B33]" strokeWidth={1.75} />
            <h2 className="font-heading text-lg font-bold text-[#1C1917]">Export Order Cart</h2>
            {count > 0 && (
              <span className="rounded-full bg-[#FDF2F4] px-2.5 py-0.5 text-xs font-bold text-[#991B33] border border-[#F7CCD5]">
                {count} {count === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="rounded-full p-2 text-[#78716C] transition-colors hover:bg-[#F0EBE3] hover:text-[#1C1917]"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="mb-4 h-16 w-16 text-[#D6D0C5]" strokeWidth={1} />
              <p className="font-heading text-lg font-bold text-[#1C1917]">
                Your export cart is empty
              </p>
              <p className="mt-1 text-xs text-[#78716C] max-w-xs">
                Select export electronics, audio devices, or smart hardware to place an order or quotation.
              </p>
              <button
                onClick={closeCart}
                className="mt-6 rounded-full border border-[#991B33] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#991B33] transition-all hover:bg-[#991B33] hover:text-white"
              >
                Explore Export Catalog
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#E7E2D9] px-5 py-5 bg-[#FAF8F5]">
            {/* Subtotal & Savings */}
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-[#78716C]">Subtotal</span>
              <div className="text-right">
                <span className="font-heading text-lg font-bold text-[#1C1917]">₹{total}</span>
                <span className="ml-2 text-xs text-[#78716C]/60 line-through">₹{originalTotal}</span>
              </div>
            </div>

            {/* Shipping */}
            <div className="mb-2 flex items-center justify-between text-xs text-[#78716C]">
              <span>Standard Logistics / Handling</span>
              <span className="font-semibold text-[#1C1917]">₹60</span>
            </div>

            {totalSavings > 0 && (
              <div className="mb-3 flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5">
                <span className="text-xs font-semibold text-emerald-800">Export Tier Savings</span>
                <span className="text-xs font-bold text-emerald-800">Save ₹{totalSavings}</span>
              </div>
            )}

            {/* Total */}
            <div className="mb-4 pt-2 border-t border-[#E7E2D9] flex items-center justify-between">
              <span className="text-sm font-bold text-[#1C1917]">Estimated Total</span>
              <span className="font-heading text-xl font-bold text-[#991B33]">₹{total + 60}</span>
            </div>

            <button
              onClick={() => {
                closeCart()
                navigate('/checkout')
              }}
              className="w-full rounded-full py-3.5 text-xs font-bold uppercase tracking-widest cursor-pointer shadow-md bg-[#991B33] text-white hover:bg-[#7E1227] transition-colors active:scale-98"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={closeCart}
              className="mt-3 w-full rounded-full py-2 text-center text-xs font-semibold text-[#78716C] transition-colors hover:text-[#991B33] cursor-pointer"
            >
              ← Continue Browsing
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
