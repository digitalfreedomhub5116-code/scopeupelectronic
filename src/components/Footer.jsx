import { useScrollReveal } from '../hooks/useScrollReveal'
import { GENRES } from '../store/cartStore'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, Mail } from 'lucide-react'

export default function Footer() {
  const [ref, isVisible] = useScrollReveal(0.08)
  const navigate = useNavigate()

  const handleGenreClick = (slug) => {
    navigate(`/${slug}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer ref={ref} className="relative border-t border-[#E7E2D9] bg-[#F4EFEA] text-[#57534E]">
      <div className="mx-auto h-px w-36 bg-gradient-to-r from-transparent via-[#991B33]/40 to-transparent" />

      <div
        className={`mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-[#1C1917] flex items-center justify-center text-white font-serif font-bold text-xs">
                SI
              </div>
              <div className="flex items-baseline gap-1 font-serif text-base font-bold tracking-wider">
                <span className="text-[#1C1917]">SCOPE</span>
                <span className="text-[#991B33]">INTERNATIONALS</span>
              </div>
            </Link>
            <p className="mt-3.5 max-w-xs text-xs sm:text-sm leading-relaxed text-[#78716C]">
              Direct-from-source global export supply chain delivering certified high-precision electronics, smart audio, and GaN power gear to 50+ countries worldwide.
            </p>
          </div>

          {/* Export Verticals */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.15em] text-[#1C1917] uppercase">
              Product Verticals
            </h4>
            <ul className="mt-4 space-y-2.5">
              {GENRES.map((g) => (
                <li key={g.id}>
                  <button
                    onClick={() => handleGenreClick(g.slug)}
                    className="text-xs sm:text-sm text-[#78716C] transition-colors hover:text-[#991B33] text-left cursor-pointer"
                  >
                    {g.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Corporate & RFQ */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.15em] text-[#1C1917] uppercase">
              Export Operations
            </h4>
            <ul className="mt-4 space-y-2.5">
              {['About Scope Hub', 'Quality & QC Protocols', 'Ocean & Air Freight', 'Customs & Compliance'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-xs sm:text-sm text-[#78716C] transition-colors hover:text-[#991B33]">
                    {link}
                  </a>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    navigate('/admin-panel-access')
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="text-xs sm:text-sm text-[#78716C] transition-colors hover:text-[#991B33] text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Admin Terminal</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#991B33]/10 text-[#991B33] border border-[#991B33]/20 font-mono font-bold">
                    HQ
                  </span>
                </button>
              </li>
            </ul>
          </div>

          {/* Quotation & Catalog Updates */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.15em] text-[#1C1917] uppercase">
              Export Catalog Dispatch
            </h4>
            <p className="mt-4 text-xs sm:text-sm text-[#78716C]">
              Receive quarterly wholesale price tiers and hardware spec-sheets.
            </p>
            <div className="mt-3 flex shadow-xs">
              <input
                type="email"
                placeholder="buyer@enterprise.com"
                className="flex-1 rounded-l-full border border-[#E7E2D9] bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#1C1917] placeholder-[#A8A29E] outline-none transition-colors focus:border-[#991B33]"
              />
              <button className="rounded-r-full bg-[#991B33] hover:bg-[#7E1227] px-4 py-2.5 text-white transition-all cursor-pointer">
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center gap-3 border-t border-[#E7E2D9] pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-[#78716C]">
            © 2026 Scope Internationals. All rights reserved. Precision electronics export.
          </p>
          <div className="flex items-center gap-5">
            {['Privacy Policy', 'Export Terms', 'Shipping & Incoterms'].map((link) => (
              <a key={link} href="#" className="text-xs text-[#78716C] transition-colors hover:text-[#991B33]">
                {link}
              </a>
            ))}
            <button
              onClick={() => {
                navigate('/admin-panel-access')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="text-xs text-[#78716C] transition-colors hover:text-[#991B33] cursor-pointer"
            >
              Portal Access
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
