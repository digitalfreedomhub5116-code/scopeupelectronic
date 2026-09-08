import { useScrollReveal } from '../hooks/useScrollReveal'
import { GENRES, useCartStore } from '../store/cartStore'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

function CategoryCard({ genre, index }) {
  const navigate = useNavigate()
  const [ref, isVisible] = useScrollReveal(0.08)
  const allProducts = useCartStore((s) => s.products)
  const visibleCount = allProducts.filter((p) => p.genre === genre.id && !p.isHidden).length

  const handleClick = () => {
    navigate(`/${genre.slug}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Asymmetric sizes for visual interest
  const sizeClasses =
    index === 0
      ? 'col-span-2 row-span-2 sm:col-span-2 sm:row-span-2'
      : index === 1
      ? 'col-span-1 row-span-1'
      : index === 2
      ? 'col-span-1 row-span-2 sm:row-span-1'
      : index === 3
      ? 'col-span-1 row-span-1'
      : 'col-span-2 row-span-1 sm:col-span-1 sm:row-span-1'

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className={`group relative cursor-pointer overflow-hidden rounded-3xl border border-[#E7E2D9] bg-white shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-stone-900/10 hover:border-[#991B33]/40 ${sizeClasses} ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Background Image */}
      <img
        src={genre.image}
        alt={genre.label}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        loading="lazy"
      />

      {/* Atmospheric Vignette Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

      {/* Card Content */}
      <div className="absolute inset-0 flex items-end justify-between p-5 sm:p-6 lg:p-7">
        <div className="max-w-[80%]">
          <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-white">
            {genre.label}
          </h3>
          <p className="text-xs text-stone-200/90 font-medium block mt-1 line-clamp-1">
            {genre.description || `${visibleCount} Flagship Devices`}
          </p>
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
            {visibleCount} Flagship Models
          </span>
        </div>

        <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/90 text-[#1C1917] backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-[#991B33] group-hover:text-white shrink-0 shadow-sm">
          <ArrowUpRight className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}

export default function GenreShowcase() {
  const [sectionRef, sectionVisible] = useScrollReveal(0.05)

  return (
    <section id="genres" className="relative py-16 sm:py-24 bg-[#FAF8F5]">
      <div ref={sectionRef} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`mb-10 sm:mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-4 transition-all duration-700 ${
            sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-[#FDF2F4] text-[#991B33] border border-[#F7CCD5] mb-3">
              <span>CURATED TECH COLLECTIONS</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1917] tracking-tight">
              Shop by Category
            </h2>
            <p className="mt-2.5 max-w-xl text-sm sm:text-base leading-relaxed text-[#57534E]">
              Explore high-fidelity audio, titanium smart wearables, GaN fast charging, and pro peripherals crafted for discerning tech lovers.
            </p>
          </div>

          <div className="hidden sm:block">
            <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider">
              {GENRES.length} Premium Collections
            </span>
          </div>
        </div>

        {/* Categories Bento Grid */}
        <div className="grid auto-rows-[200px] grid-cols-2 gap-3 sm:auto-rows-[240px] sm:grid-cols-3 sm:gap-4 lg:auto-rows-[260px] lg:gap-5">
          {GENRES.map((genre, index) => (
            <CategoryCard key={genre.id} genre={genre} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
