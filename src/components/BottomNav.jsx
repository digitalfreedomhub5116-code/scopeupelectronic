import { useLocation, useNavigate } from 'react-router-dom'
import { Home, LayoutGrid, Sparkles, Heart, User } from 'lucide-react'
import { useCartStore } from '../store/cartStore'

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const wishlistCount = useCartStore((s) => s.getWishlistCount())
  const wishlistPing = useCartStore((s) => s.wishlistPing)
  const toggleWishlistDrawer = useCartStore((s) => s.toggleWishlistDrawer)
  const openCategories = useCartStore((s) => s.openCategories)
  const openProfile = useCartStore((s) => s.openProfile)

  // Hide bottom nav on checkout or administrative screens
  if (location.pathname === '/checkout' || location.pathname.startsWith('/admin-panel')) {
    return null
  }

  const isHome = location.pathname === '/'

  const handleHomeClick = () => {
    if (isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleCategoriesClick = () => {
    if (openCategories) {
      openCategories()
    } else {
      const el = document.querySelector('#genres')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      } else {
        navigate('/')
        setTimeout(() => {
          document.querySelector('#genres')?.scrollIntoView({ behavior: 'smooth' })
        }, 150)
      }
    }
  }

  const handleTrendingClick = () => {
    const el = document.querySelector('#products')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => {
        document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' })
      }, 150)
    }
  }

  const handleWishlistClick = () => {
    toggleWishlistDrawer()
  }

  const handleProfileClick = () => {
    if (openProfile) {
      openProfile()
    } else {
      navigate('/track-order')
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      {/* Background with iOS/Android backdrop blur and subtle top border */}
      <nav
        className="relative bg-white/95 backdrop-blur-xl border-t border-[#E7E2D9] px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_24px_rgba(0,0,0,0.06)]"
        aria-label="Mobile Navigation"
      >
        <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
          {/* 1. Home */}
          <button
            onClick={handleHomeClick}
            className={`flex flex-col items-center justify-center py-1 group transition-all duration-200 cursor-pointer ${
              isHome ? 'text-[#991B33]' : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
            aria-label="Home"
          >
            <div className="relative">
              <Home
                className={`h-5 w-5 transition-transform duration-200 group-active:scale-90 ${
                  isHome ? 'stroke-[2.4px]' : 'stroke-[1.75px]'
                }`}
              />
              {isHome && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[#991B33]" />
              )}
            </div>
            <span
              className={`text-[10px] tracking-tight mt-1 font-medium ${
                isHome ? 'font-bold text-[#991B33]' : 'text-[#78716C]'
              }`}
            >
              Home
            </span>
          </button>

          {/* 2. Categories */}
          <button
            onClick={handleCategoriesClick}
            className="flex flex-col items-center justify-center py-1 group transition-all duration-200 cursor-pointer text-[#78716C] hover:text-[#991B33]"
            aria-label="Categories"
          >
            <LayoutGrid className="h-5 w-5 stroke-[1.75px] transition-transform duration-200 group-active:scale-90" />
            <span className="text-[10px] tracking-tight mt-1 font-medium text-[#78716C]">
              Categories
            </span>
          </button>

          {/* 3. Trends / Studio */}
          <button
            onClick={handleTrendingClick}
            className="flex flex-col items-center justify-center py-1 group transition-all duration-200 cursor-pointer text-[#78716C] hover:text-[#991B33]"
            aria-label="Trending Studio"
          >
            <div className="relative">
              <Sparkles className="h-5 w-5 stroke-[1.75px] transition-transform duration-200 group-active:scale-90" />
            </div>
            <span className="text-[10px] tracking-tight mt-1 font-medium text-[#78716C]">
              Trending
            </span>
          </button>

          {/* 4. Wishlist */}
          <button
            onClick={handleWishlistClick}
            className={`flex flex-col items-center justify-center py-1 group transition-all duration-200 cursor-pointer text-[#78716C] hover:text-[#991B33]`}
            aria-label="Wishlist"
          >
            <div className="relative">
              <Heart
                className={`h-5 w-5 stroke-[1.75px] transition-all duration-300 group-active:scale-90 ${
                  wishlistCount > 0 ? 'text-[#991B33]' : ''
                } ${wishlistPing ? 'animate-heart-burst fill-[#991B33]' : ''}`}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#991B33] px-1 text-[9px] font-extrabold text-white shadow-xs">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] tracking-tight mt-1 font-medium ${
                wishlistCount > 0 ? 'text-[#991B33] font-semibold' : 'text-[#78716C]'
              }`}
            >
              Wishlist
            </span>
          </button>

          {/* 5. Profile */}
          <button
            onClick={handleProfileClick}
            className="flex flex-col items-center justify-center py-1 group transition-all duration-200 cursor-pointer text-[#78716C] hover:text-[#991B33]"
            aria-label="Profile"
          >
            <User className="h-5 w-5 stroke-[1.75px] transition-transform duration-200 group-active:scale-90" />
            <span className="text-[10px] tracking-tight mt-1 font-medium text-[#78716C]">
              Profile
            </span>
          </button>
        </div>
      </nav>
    </div>
  )
}
