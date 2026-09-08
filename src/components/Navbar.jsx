import { ShoppingBag, User, X, Menu, Heart } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useScrolled } from '../hooks/useScrollReveal'
import AuthModal from './AuthModal'

export default function Navbar({ visible = true }) {
  const scrolled = useScrolled(20)
  const toggleCart = useCartStore((s) => s.toggleCart)
  const itemCount = useCartStore((s) => s.getItemCount())
  const wishlistCount = useCartStore((s) => s.getWishlistCount())
  const wishlistPing = useCartStore((s) => s.wishlistPing)
  const toggleWishlistDrawer = useCartStore((s) => s.toggleWishlistDrawer)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const navigate = useNavigate()

  const handleNavClick = (hash) => {
    setMobileMenuOpen(false)
    if (hash === '#') {
      navigate('/')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    navigate('/')
    setTimeout(() => {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
          visible ? 'translate-y-0' : '-translate-y-full pointer-events-none'
        } ${
          scrolled
            ? 'navbar-glass shadow-sm shadow-stone-900/5'
            : 'bg-[#FAF8F5]/80 backdrop-blur-sm'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between sm:h-20">
            {/* 1. Logo & Name */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              {/* Circular "SI" Monogram Badge */}
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-[#1C1917] flex items-center justify-center text-white font-serif font-bold text-sm sm:text-base tracking-tighter shadow-sm transition-transform duration-300 group-hover:scale-105">
                SI
              </div>

              {/* Brand Typography */}
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1 font-serif text-base sm:text-lg font-bold tracking-[0.08em] leading-tight">
                  <span className="text-[#1C1917]">SCOPE</span>
                  <span className="text-[#991B33]">INTERNATIONALS</span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.2em] text-[#78716C] uppercase leading-tight">
                  PREMIUM ELECTRONICS & TECH
                </span>
              </div>
            </Link>

            {/* 2. Desktop Navigation: Home, All Products & Categories */}
            <div className="hidden md:flex items-center gap-7 lg:gap-9">
              <button
                onClick={() => handleNavClick('#')}
                className="text-xs sm:text-sm font-bold text-[#1C1917] transition-colors hover:text-[#991B33] tracking-[0.15em] uppercase cursor-pointer"
              >
                HOME
              </button>
              <button
                onClick={() => handleNavClick('#products')}
                className="text-xs sm:text-sm font-bold text-[#57534E] transition-colors hover:text-[#991B33] tracking-[0.15em] uppercase cursor-pointer"
              >
                ALL PRODUCTS
              </button>
              <button
                onClick={() => handleNavClick('#genres')}
                className="text-xs sm:text-sm font-bold text-[#57534E] transition-colors hover:text-[#991B33] tracking-[0.15em] uppercase cursor-pointer"
              >
                CATEGORIES
              </button>
            </div>

            {/* 3. Action Icons: Account, Wishlist, Cart (+ Mobile Menu Toggle) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Account Icon */}
              <button
                onClick={() => setIsAuthOpen(true)}
                className="group rounded-full p-2 text-[#57534E] transition-all hover:bg-white hover:text-[#991B33] hover:shadow-xs cursor-pointer"
                aria-label="Account"
                title="My Account"
              >
                <User className="h-5 w-5" strokeWidth={1.75} />
              </button>

              {/* Wishlist Icon */}
              <button
                onClick={toggleWishlistDrawer}
                className={`group relative rounded-full p-2 transition-all duration-300 hover:bg-white hover:shadow-xs ${
                  wishlistPing
                    ? 'animate-wishlist-ping text-rose-500 bg-rose-50'
                    : 'text-[#57534E] hover:text-[#991B33]'
                }`}
                aria-label="Wishlist"
                title="Wishlist"
              >
                <Heart
                  className={`h-5 w-5 transition-all duration-300 ${
                    wishlistCount > 0 || wishlistPing
                      ? 'fill-[#991B33] text-[#991B33] scale-110'
                      : 'group-hover:scale-110'
                  }`}
                  strokeWidth={1.75}
                />
                {wishlistCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#991B33] text-[10px] font-bold text-white shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Icon */}
              <button
                onClick={toggleCart}
                className="group relative rounded-full p-2 text-[#57534E] transition-all hover:bg-white hover:text-[#991B33] hover:shadow-xs cursor-pointer"
                aria-label="Shopping Bag"
                title="Shopping Bag"
              >
                <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
                {itemCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#991B33] text-[10px] font-bold text-white shadow-xs">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-full p-2 text-[#57534E] transition-all hover:bg-white hover:text-[#991B33] md:hidden cursor-pointer"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" strokeWidth={1.75} />
                ) : (
                  <Menu className="h-5 w-5" strokeWidth={1.75} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            mobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="navbar-glass border-t border-[#E7E2D9] px-5 pb-5 pt-3 bg-[#FAF8F5]/98 shadow-lg">
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => handleNavClick('#')}
                className="text-left text-xs font-bold text-[#1C1917] hover:text-[#991B33] tracking-[0.15em] uppercase py-2 cursor-pointer border-b border-[#E7E2D9]/60"
              >
                HOME
              </button>
              <button
                onClick={() => handleNavClick('#products')}
                className="text-left text-xs font-bold text-[#57534E] hover:text-[#991B33] tracking-[0.15em] uppercase py-2 cursor-pointer border-b border-[#E7E2D9]/60"
              >
                ALL PRODUCTS
              </button>
              <button
                onClick={() => handleNavClick('#genres')}
                className="text-left text-xs font-bold text-[#57534E] hover:text-[#991B33] tracking-[0.15em] uppercase py-2 cursor-pointer border-b border-[#E7E2D9]/60"
              >
                CATEGORIES
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  setIsAuthOpen(true)
                }}
                className="flex items-center gap-2 text-left text-xs font-bold text-[#57534E] hover:text-[#991B33] tracking-[0.15em] uppercase py-2 cursor-pointer border-b border-[#E7E2D9]/60"
              >
                <User className="h-4 w-4 text-[#991B33]" />
                <span>ACCOUNT</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  toggleWishlistDrawer()
                }}
                className="flex items-center gap-2 text-left text-xs font-bold text-[#57534E] hover:text-[#991B33] tracking-[0.15em] uppercase py-2 cursor-pointer border-b border-[#E7E2D9]/60"
              >
                <Heart className="h-4 w-4 text-[#991B33]" />
                <span>WISHLIST ({wishlistCount})</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  toggleCart()
                }}
                className="flex items-center gap-2 text-left text-xs font-bold text-[#57534E] hover:text-[#991B33] tracking-[0.15em] uppercase py-2 cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4 text-[#991B33]" />
                <span>SHOPPING BAG ({itemCount})</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

    {/* Customer Auth & Orders Modal - Rendered outside of nav to avoid CSS transform stacking context */}
    <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  )
}
