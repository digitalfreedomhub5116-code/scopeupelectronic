import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Check, Package, ArrowRight, ShoppingBag, Truck } from 'lucide-react'

export default function OrderConfirmedPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [showCheck, setShowCheck] = useState(false)

  const orderId = searchParams.get('orderId') || 'N/A'
  const total = searchParams.get('total') || '0'
  const method = searchParams.get('method') || 'COD'

  // Trigger the checkmark animation after a slight delay on mount
  useEffect(() => {
    const timer = setTimeout(() => setShowCheck(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Inline keyframe animation styles */}
      <style>{`
        @keyframes checkBounceIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.9;
          }
          70% {
            transform: scale(0.92);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes checkStroke {
          0% {
            stroke-dashoffset: 30;
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
        .check-circle-animate {
          animation: checkBounceIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .check-stroke-animate {
          animation: checkStroke 0.4s ease-out 0.5s forwards;
          stroke-dasharray: 30;
          stroke-dashoffset: 30;
          opacity: 0;
        }
        @keyframes fadeInUp {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .fade-in-up-1 {
          animation: fadeInUp 0.5s ease-out 0.6s forwards;
          opacity: 0;
        }
        .fade-in-up-2 {
          animation: fadeInUp 0.5s ease-out 0.8s forwards;
          opacity: 0;
        }
        .fade-in-up-3 {
          animation: fadeInUp 0.5s ease-out 1.0s forwards;
          opacity: 0;
        }
        .fade-in-up-4 {
          animation: fadeInUp 0.5s ease-out 1.2s forwards;
          opacity: 0;
        }
      `}</style>

      <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col selection:bg-[#991B33] selection:text-white">
        {/* Main Content — Centered */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
          <div className="mx-auto max-w-md w-full text-center">
            {/* Animated Green Checkmark Circle */}
            <div className="flex justify-center mb-6">
              <div
                className={`h-24 w-24 rounded-full flex items-center justify-center ${
                  showCheck ? 'check-circle-animate' : 'opacity-0 scale-0'
                }`}
                style={{ backgroundColor: '#16a34a' }}
              >
                <svg
                  className={showCheck ? 'check-stroke-animate' : 'opacity-0'}
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 12 10 16 18 8" />
                </svg>
              </div>
            </div>

            {/* Heading */}
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#1C1917] tracking-tight fade-in-up-1">
              Order Confirmed!
            </h1>

            {/* Order Number in Crimson */}
            <p className="mt-3 text-sm sm:text-base font-bold text-[#991B33] tracking-wider fade-in-up-1">
              Consignment Ref #{orderId}
            </p>

            {/* Thank you subtitle */}
            <p className="mt-2 text-sm text-[#78716C] fade-in-up-1">
              Thank you for ordering with Scope Internationals!
            </p>

            {/* Summary Card */}
            <div className="mt-8 rounded-2xl border border-[#E7E2D9] bg-white p-5 sm:p-6 text-left space-y-4 shadow-sm fade-in-up-2">
              {/* Order Number */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-[#FDF2F4] border border-[#F7CCD5] flex items-center justify-center shrink-0">
                    <Package className="h-4 w-4 text-[#991B33]" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#78716C]">Order Reference</span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#1C1917] font-mono">#{orderId}</span>
              </div>

              {/* Divider */}
              <div className="border-t border-[#E7E2D9]" />

              {/* Total Amount */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-[#FDF2F4] border border-[#F7CCD5] flex items-center justify-center shrink-0">
                    <ShoppingBag className="h-4 w-4 text-[#991B33]" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#78716C]">Total Amount</span>
                </div>
                <span className="text-sm sm:text-base font-extrabold text-[#991B33]">
                  ₹{Number(total).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Divider */}
              <div className="border-t border-[#E7E2D9]" />

              {/* Payment Method */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-[#FDF2F4] border border-[#F7CCD5] flex items-center justify-center shrink-0">
                    <Check className="h-4 w-4 text-[#991B33]" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#78716C]">Payment Method</span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#1C1917]">
                  {method === 'COD' ? 'Cash on Delivery' : method}
                </span>
              </div>

              {/* Divider */}
              <div className="border-t border-[#E7E2D9]" />

              {/* Estimated Delivery */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-[#FDF2F4] border border-[#F7CCD5] flex items-center justify-center shrink-0">
                    <Truck className="h-4 w-4 text-[#991B33]" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#78716C]">Logistics Timeline</span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#1C1917]">3-5 Business Days</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 space-y-3 fade-in-up-3">
              {/* Track Your Order */}
              <Link
                to={`/track-order?orderId=${orderId}`}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#991B33] text-white hover:bg-[#7E1227] shadow-md transition-colors"
              >
                <Truck className="h-4 w-4" />
                <span>Track Consignment</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              {/* Continue Shopping */}
              <Link
                to="/"
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#E7E2D9] bg-white hover:border-[#991B33] hover:text-[#991B33] py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1C1917] transition-all shadow-xs"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Return to Catalog</span>
              </Link>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#E7E2D9] py-4 text-center text-xs text-[#78716C]">
          © 2026 Scope Internationals. All rights reserved.
        </footer>
      </div>
    </>
  )
}
