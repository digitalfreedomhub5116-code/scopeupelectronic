import { ArrowRight, MessageCircle } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useCartStore, MOCK_PRODUCTS } from '../store/cartStore'

export default function Hero() {
  const [ref, isVisible] = useScrollReveal(0.05)
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  const flagshipProduct = MOCK_PRODUCTS.find((p) => p.id === 1) || MOCK_PRODUCTS[0]

  const handleRequestSample = () => {
    if (flagshipProduct) {
      addItem(flagshipProduct)
      openCart()
    }
  }

  const handleScrollToProducts = () => {
    const el = document.querySelector('#products')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] pt-24 sm:pt-32 pb-12 sm:pb-16">
      {/* Subtle Warm Atmospheric Glow in Top Corners */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#F5EFEA] blur-3xl opacity-60" />
      <div className="pointer-events-none absolute top-1/4 -right-40 h-96 w-96 rounded-full bg-[#FDF2F4] blur-3xl opacity-50" />

      <div ref={ref} className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main 2-Column Hero Grid (Matching Reference Image) */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Brand Eyebrow, Editorial Serif Title, Narrative Body, and Dual Action CTAs */}
          <div
            className={`lg:col-span-7 flex flex-col justify-center text-left transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Pill Tag (Matching Reference: SCOPE INTERNATIONALS • GLOBAL EXPORTS) */}
            <div className="inline-flex items-center self-start">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-[#FDF2F4] text-[#991B33] border border-[#F7CCD5] shadow-xs">
                <span>SCOPE INTERNATIONALS</span>
                <span className="text-[#991B33]/60">•</span>
                <span>GLOBAL EXPORTS</span>
              </span>
            </div>

            {/* Editorial Serif Main Headline (Matching Reference Typography Style) */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[54px] font-bold text-[#1C1917] tracking-tight leading-[1.12] mt-4 sm:mt-5">
              High-Precision Electronics,
              <br className="hidden sm:inline" />
              Exported Worldwide with
              <br className="hidden sm:inline" />
              Integrity
            </h1>

            {/* Body Copy (Matching Reference layout style) */}
            <p className="mt-4 sm:mt-5 text-sm sm:text-base leading-relaxed text-[#57534E] max-w-xl font-sans">
              Direct-from-manufacturer global supply chain delivering certified Smart Audio, Wearables, GaN Fast Charging Systems, and High-Performance Peripherals to 50+ countries.
            </p>

            {/* Dual CTAs (Matching Reference Image) */}
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3.5">
              {/* Primary Crimson Button */}
              <button
                onClick={handleScrollToProducts}
                className="inline-flex items-center gap-2 rounded-full bg-[#991B33] hover:bg-[#7E1227] text-white px-6 py-3.5 text-xs sm:text-sm font-bold tracking-wide transition-all shadow-md shadow-[#991B33]/20 hover:shadow-lg hover:shadow-[#991B33]/30 active:scale-98 cursor-pointer"
              >
                <span>Request Export Quotation</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              {/* Secondary Bordered White Button */}
              <button
                onClick={handleScrollToProducts}
                className="inline-flex items-center gap-2 rounded-full border border-[#E7E2D9] bg-white hover:bg-[#F4EFEA] text-[#1C1917] px-6 py-3.5 text-xs sm:text-sm font-bold tracking-wide transition-all shadow-xs hover:border-[#D6D0C5] active:scale-98 cursor-pointer"
              >
                <span>Explore Star Products</span>
              </button>
            </div>
          </div>

          {/* Right Column: Floating White Product Card with STAR HIGHLIGHT Badge */}
          <div
            className={`lg:col-span-5 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="relative rounded-3xl bg-white p-4 sm:p-5 border border-[#E7E2D9] shadow-xl shadow-stone-900/5">
              {/* Top-Right "STAR HIGHLIGHT" Badge (Matching Reference) */}
              <div className="absolute top-4 right-4 z-20">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#991B33] text-white text-[10px] font-extrabold tracking-wider uppercase shadow-xs">
                  STAR HIGHLIGHT
                </span>
              </div>

              {/* Featured Product Image */}
              <div className="relative aspect-[16/10] sm:aspect-[16/11] w-full overflow-hidden rounded-2xl bg-stone-100">
                <img
                  src={flagshipProduct.image}
                  alt={flagshipProduct.name}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                {/* Category Tag on Image */}
                <div className="absolute bottom-3 left-3 z-10">
                  <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#1C1917]/85 backdrop-blur-sm text-amber-300 border border-white/15">
                    FLAGSHIP AUDIO
                  </span>
                </div>
              </div>

              {/* Card Details */}
              <div className="mt-3.5">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1C1917] leading-snug">
                  {flagshipProduct.name}
                </h3>
                <p className="mt-1 text-xs text-[#78716C] leading-relaxed line-clamp-1">
                  Bluetooth 5.4 • 48dB Hybrid ANC • 40mm Titanium Drivers
                </p>

                {/* 3-Column Specifications Box (Matching Reference: PURITY / MESH / PACK) */}
                <div className="mt-3.5 grid grid-cols-3 gap-2 rounded-xl bg-[#FAF8F5] border border-[#EAE5DD] p-2.5 text-center">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#78716C] block">
                      GRADE
                    </span>
                    <span className="text-xs font-bold text-[#1C1917] mt-0.5 block">
                      {flagshipProduct.purity || 'GRADE A+'}
                    </span>
                  </div>
                  <div className="border-x border-[#EAE5DD]">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#78716C] block">
                      COMPLIANCE
                    </span>
                    <span className="text-xs font-bold text-[#1C1917] mt-0.5 block">
                      {flagshipProduct.compliance || 'CE / FCC / RoHS'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#78716C] block">
                      PACK / MOQ
                    </span>
                    <span className="text-xs font-bold text-[#1C1917] mt-0.5 block">
                      {flagshipProduct.pack || '50 Units Carton'}
                    </span>
                  </div>
                </div>

                {/* Dark Button: Request Sample & Quote (Matching Reference) */}
                <button
                  onClick={handleRequestSample}
                  className="mt-3.5 w-full flex items-center justify-center gap-2 rounded-full bg-[#1C1917] hover:bg-black text-white py-3 text-xs sm:text-sm font-bold tracking-wide transition-all shadow-sm active:scale-98 cursor-pointer"
                >
                  <span>Request Sample & Quote</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── 4 White Stat Metric Boxes (Directly Matching Reference Image Bottom Bar) ── */}
        <div
          className={`mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Metric 1 */}
          <div className="rounded-2xl bg-white border border-[#E7E2D9] p-4 sm:p-6 text-center shadow-xs flex flex-col justify-center items-center">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917]">
              50+
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-wider text-[#78716C] uppercase mt-1">
              50+ Export Destinations
            </span>
          </div>

          {/* Metric 2: Crimson Highlight */}
          <div className="rounded-2xl bg-white border border-[#E7E2D9] p-4 sm:p-6 text-center shadow-xs flex flex-col justify-center items-center">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#991B33]">
              100%
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-wider text-[#78716C] uppercase mt-1">
              100% QC & Certified
            </span>
          </div>

          {/* Metric 3 */}
          <div className="rounded-2xl bg-white border border-[#E7E2D9] p-4 sm:p-6 text-center shadow-xs flex flex-col justify-center items-center">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917]">
              500,000+
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-wider text-[#78716C] uppercase mt-1">
              Units Monthly Capacity
            </span>
          </div>

          {/* Metric 4: Emerald / Green Highlight */}
          <div className="rounded-2xl bg-white border border-[#E7E2D9] p-4 sm:p-6 text-center shadow-xs flex flex-col justify-center items-center">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#059669]">
              24 - 48h
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-wider text-[#78716C] uppercase mt-1">
              24-48h RFQ Turnaround
            </span>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Desk Button (Matching Reference Image Bottom Right) */}
      <a
        href="https://wa.me/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-[#00A859] hover:bg-[#008f4c] text-white px-4 py-2.5 text-xs sm:text-sm font-bold shadow-lg shadow-[#00A859]/30 transition-all duration-300 hover:scale-105 active:scale-95"
        title="Contact Scope Internationals WhatsApp Desk"
      >
        <MessageCircle className="h-4 w-4 fill-white" />
        <span>WhatsApp Desk</span>
      </a>
    </section>
  )
}

