import { ShieldCheck, Cpu, CheckCircle2, PlaneTakeoff } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function FeatureBanner() {
  const [ref, isVisible] = useScrollReveal(0.12)

  return (
    <section id="feature" ref={ref} className="relative overflow-hidden py-16 sm:py-24 bg-[#F4EFEA] border-y border-[#E7E2D9]">
      <div
        className={`relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Left: Engineering Hardware Poster / Imagery */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-sm sm:max-w-md w-full">
              <div className="relative overflow-hidden rounded-3xl border border-[#E7E2D9] bg-white shadow-xl shadow-stone-900/5">
                <img
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80"
                  alt="Scope Internationals Precision Electronics Engineering"
                  className="w-full h-auto object-cover rounded-2xl transition-transform duration-700 ease-out group-hover:scale-104"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#991B33] text-white mb-2">
                    ISO9001 CERTIFIED
                  </span>
                  <h4 className="font-serif text-lg font-bold">
                    Zero-Defect Quality Protocol
                  </h4>
                  <p className="text-xs text-stone-200 mt-0.5">
                    Automated circuit continuity & 72-hour thermal stress burn-in testing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Brand Engineering Narrative */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center self-start">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-[#FDF2F4] text-[#991B33] border border-[#F7CCD5]">
                ENGINEERING & COMPLIANCE
              </span>
            </div>

            {/* Headline */}
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1917] tracking-tight leading-tight mt-4">
              Engineered for Global Reliability
            </h2>

            {/* Paragraph */}
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#57534E] max-w-2xl font-sans">
              At Scope Internationals, every electronic unit undergoes rigorous multi-tier testing before international dispatch. From thermal chamber simulations to automated circuit continuity and CE/FCC/RoHS compliance verification, we provide global importers with hardware built to the highest tier of international manufacturing standards.
            </p>

            {/* 3 Pillars */}
            <div className="mt-6 space-y-3.5 max-w-xl">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-[#FDF2F4] border border-[#F7CCD5] text-[#991B33] flex items-center justify-center shrink-0 mt-0.5">
                  <Cpu className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#1C1917]">
                    Tier-1 Semiconductor Components
                  </h4>
                  <p className="text-xs text-[#78716C] mt-0.5">
                    Authentic IC controllers sourced directly from Nordic, PixArt, Navitas, and Sony.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-[#FDF2F4] border border-[#F7CCD5] text-[#991B33] flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#1C1917]">
                    Full Compliance Documentation
                  </h4>
                  <p className="text-xs text-[#78716C] mt-0.5">
                    UN38.3 lithium battery transport safety, MSDS records, and CE/FCC certificates provided for customs.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-[#FDF2F4] border border-[#F7CCD5] text-[#991B33] flex items-center justify-center shrink-0 mt-0.5">
                  <PlaneTakeoff className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#1C1917]">
                    Express Worldwide Freight Logistics
                  </h4>
                  <p className="text-xs text-[#78716C] mt-0.5">
                    Door-to-door air cargo and FCL/LCL ocean freight dispatch to over 50 global destinations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
