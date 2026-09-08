export default function MarqueeBanner() {
  const items = [
    'CE & FCC CERTIFIED',
    '✦',
    'GLOBAL AIR & SEA FREIGHT',
    '✦',
    'SMART AUDIO SYSTEMS',
    '✦',
    'GAN III FAST CHARGING',
    '✦',
    'AMOLED WEARABLES',
    '✦',
    'TIER-1 SEMICONDUCTORS',
    '✦',
    '50+ EXPORT DESTINATIONS',
    '✦',
    '24-48H RFQ TURNAROUND',
    '✦',
    'ISO9001 QUALITY ASSURED',
    '✦',
  ]

  return (
    <div className="relative overflow-hidden border-y border-[#E7E2D9] bg-[#F4EFEA] py-3.5">
      <div className="flex animate-[marquee_35s_linear_infinite] whitespace-nowrap">
        {[...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            className={`mx-4 sm:mx-6 text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase ${
              item === '✦' ? 'text-[#991B33]' : 'text-[#57534E]'
            }`}
          >
            {item}
          </span>
        ))}
      </div>

      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#FAF8F5] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#FAF8F5] to-transparent" />

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  )
}
