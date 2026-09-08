import { ShoppingBag, User, X, Menu, Heart, Search, SlidersHorizontal, Bell, LayoutGrid } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
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
  const [mobileSearchQuery, setMobileSearchQuery] = useState('')
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

  const handleMobileSearch = (e) => {
    e.preventDefault()
    if (mobileSearchQuery.trim()) {
      handleNavClick('#products')
    }
  }

  return (
    <>
      {/* ══════════════════════════════════════════════════════════
          MOBILE NAVBAR (< md) — App-style header with search bar
          ══════════════════════════════════════════════════════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 md:hidden transition-all duration-300 ease-out ${
          visible ? 'translate-y-0' : '-translate-y-full pointer-events-none'
        }`}
      >
        {/* Gradient Background Layer */}
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            scrolled
              ? 'bg-gradient-to-b from-[#FAF8F5] via-[#FAF8F5] to-[#FAF8F5]/95 shadow-sm shadow-stone-900/5'
              : 'bg-gradient-to-b from-[#FAF8F5] to-[#F5F0EA]/90'
          }`}
          style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
        />

        <div className="relative px-4 pt-3 pb-3">
          {/* Row 1: Grid Icon · WELCOME · Notification Bell */}
          <div className="flex items-center justify-between mb-3">
            {/* Grid / Menu Icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center h-10 w-10 rounded-xl bg-white/60 backdrop-blur-sm text-[#1C1917] transition-all active:scale-95"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="h-[18px] w-[18px]" strokeWidth={1.8} />
              ) : (
                <LayoutGrid className="h-[18px] w-[18px]" strokeWidth={1.8} />
              )}
            </button>

            {/* WELCOME / Brand Text */}
            <Link to="/" className="flex flex-col items-center">
              <span className="font-serif text-lg font-bold tracking-[0.15em] text-[#1C1917]">
                WELCOME
              </span>
            </Link>

            {/* Notification / Cart Bell */}
            <button
              onClick={toggleCart}
              className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-white/60 backdrop-blur-sm text-[#1C1917] transition-all active:scale-95"
              aria-label="Shopping Bag"
            >
              <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#991B33] text-[9px] font-bold text-white shadow-sm">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Row 2: Search Bar */}
          <form onSubmit={handleMobileSearch}>
            <div className="relative flex items-center h-11 rounded-2xl bg-white/70 backdrop-blur-sm border border-[#E7E2D9]/60 shadow-sm px-3.5 gap-2.5">
              {/* Search Icon */}
              <Search className="h-4 w-4 text-[#A8A29E] shrink-0" strokeWidth={2} />

              {/* Input */}
              <input
                type="text"
                placeholder="Ai search"
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-[#1C1917] placeholder-[#A8A29E] outline-none font-medium"
              />

              {/* Filter / Sliders Icon */}
              <button
                type="button"
                onClick={() => handleNavClick('#genres')}
                className="shrink-0 text-[#78716C] active:text-[#991B33] transition-colors"
                aria-label="Filters"
              >
                <SlidersHorizontal className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </form>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="relative border-t border-[#E7E2D9]/60 px-5 pb-5 pt-3 bg-[#FAF8F5]/98 backdrop-blur-md shadow-lg">
            <div className="flex flex-col gap-1">
              <button
                onClick={() => handleNavClick('#')}
                className="flex items-center gap-3 text-left text-xs font-bold text-[#1C1917] hover:text-[#991B33] tracking-[0.15em] uppercase py-3 cursor-pointer border-b border-[#E7E2D9]/50"
              >
                HOME
              </button>
              <button
                onClick={() => handleNavClick('#products')}
                className="flex items-center gap-3 text-left text-xs font-bold text-[#57534E] hover:text-[#991B33] tracking-[0.15em] uppercase py-3 cursor-pointer border-b border-[#E7E2D9]/50"
              >
                ALL PRODUCTS
              </button>
              <button
                onClick={() => handleNavClick('#genres')}
                className="flex items-center gap-3 text-left text-xs font-bold text-[#57534E] hover:text-[#991B33] tracking-[0.15em] uppercase py-3 cursor-pointer border-b border-[#E7E2D9]/50"
              >
                CATEGORIES
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  setIsAuthOpen(true)
                }}
                className="flex items-center gap-3 text-left text-xs font-bold text-[#57534E] hover:text-[#991B33] tracking-[0.15em] uppercase py-3 cursor-pointer border-b border-[#E7E2D9]/50"
              >
                <User className="h-4 w-4 text-[#991B33]" />
                <span>ACCOUNT</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  toggleWishlistDrawer()
                }}
                className="flex items-center gap-3 text-left text-xs font-bold text-[#57534E] hover:text-[#991B33] tracking-[0.15em] uppercase py-3 cursor-pointer border-b border-[#E7E2D9]/50"
              >
                <Heart className={`h-4 w-4 ${wishlistCount > 0 ? 'fill-[#991B33] text-[#991B33]' : 'text-[#991B33]'}`} />
                <span>WISHLIST{wishlistCount > 0 ? ` (${wishlistCount})` : ''}</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  toggleCart()
                }}
                className="flex items-center gap-3 text-left text-xs font-bold text-[#57534E] hover:text-[#991B33] tracking-[0.15em] uppercase py-3 cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4 text-[#991B33]" />
                <span>SHOPPING BAG{itemCount > 0 ? ` (${itemCount})` : ''}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════
          DESKTOP NAVBAR (md+) — Classic horizontal bar
          ══════════════════════════════════════════════════════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 hidden md:block transition-all duration-300 ease-out ${
          visible ? 'translate-y-0' : '-translate-y-full pointer-events-none'
        } ${
          scrolled
            ? 'navbar-glass shadow-sm shadow-stone-900/5'
            : 'bg-[#FAF8F5]/80 backdrop-blur-sm'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* 1. Logo & Name */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              {/* Circular "SI" Monogram Badge */}
              <div className="h-10 w-10 rounded-full bg-[#1C1917] flex items-center justify-center text-white font-serif font-bold text-base tracking-tighter shadow-sm transition-transform duration-300 group-hover:scale-105">
                SI
              </div>

              {/* Brand Typography */}
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1 font-serif text-lg font-bold tracking-[0.08em] leading-tight">
                  <span className="text-[#1C1917]">SCOPE</span>
                  <span className="text-[#991B33]">INTERNATIONALS</span>
                </div>
                <span className="text-[10px] font-semibold tracking-[0.2em] text-[#78716C] uppercase leading-tight">
                  PREMIUM ELECTRONICS & TECH
                </span>
              </div>
            </Link>

            {/* 2. Desktop Navigation Links */}
            <div className="flex items-center gap-7 lg:gap-9">
              <button
                onClick={() => handleNavClick('#')}
                className="text-sm font-bold text-[#1C1917] transition-colors hover:text-[#991B33] tracking-[0.15em] uppercase cursor-pointer"
              >
                HOME
              </button>
              <button
                onClick={() => handleNavClick('#products')}
                className="text-sm font-bold text-[#57534E] transition-colors hover:text-[#991B33] tracking-[0.15em] uppercase cursor-pointer"
              >
                ALL PRODUCTS
              </button>
              <button
                onClick={() => handleNavClick('#genres')}
                className="text-sm font-bold text-[#57534E] transition-colors hover:text-[#991B33] tracking-[0.15em] uppercase cursor-pointer"
              >
                CATEGORIES
              </button>
            </div>

            {/* 3. Action Icons */}
            <div className="flex items-center gap-3">
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
            </div>
          </div>
        </div>
      </nav>

      {/* Customer Auth & Orders Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  )
}
