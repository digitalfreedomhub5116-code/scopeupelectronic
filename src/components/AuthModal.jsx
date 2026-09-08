import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  X,
  User,
  Lock,
  Mail,
  Phone,
  CheckCircle2,
  ArrowRight,
  LogOut,
  Package,
  RefreshCw,
  Sparkles,
  ShieldCheck
} from 'lucide-react'
import {
  getCurrentCustomer,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  logoutCustomer,
  initAuthListener
} from '../lib/db'
import { useNavigate } from 'react-router-dom'

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    if (isOpen) {
      const user = getCurrentCustomer()
      setCurrentUser(user)
      setError('')
      setSuccessMsg('')
    }
  }, [isOpen])

  useEffect(() => {
    const unsub = initAuthListener((user) => {
      setCurrentUser(user)
      if (user && onAuthSuccess) {
        onAuthSuccess(user)
      }
    })
    return () => unsub && unsub()
  }, [onAuthSuccess])

  if (!isOpen) return null

  // Google Account Sign-In (Native Google Cloud OAuth Centered Popup)
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError('')
    try {
      const user = await signInWithGoogle()
      if (user) {
        setCurrentUser(user)
        if (onAuthSuccess) {
          onAuthSuccess(user)
        }
      }
    } catch (err) {
      console.warn('Native Google sign-in failed:', err)
      setError(err.message || 'Google sign-in could not be completed.')
    } finally {
      setGoogleLoading(false)
    }
  }

  // Email / Password submission
  const handleEmailAuth = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (isSignUp && !name.trim()) {
      setError('Please enter your full name.')
      return
    }

    setLoading(true)
    try {
      let user
      if (isSignUp) {
        user = await signUpWithEmail(email, password, name, phone)
        setSuccessMsg('Account created successfully!')
      } else {
        user = await signInWithEmail(email, password)
        setSuccessMsg('Welcome back!')
      }

      if (user) {
        setCurrentUser(user)
        if (onAuthSuccess) {
          setTimeout(() => onAuthSuccess(user), 600)
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logoutCustomer()
    setCurrentUser(null)
  }

  const handleViewOrders = () => {
    onClose()
    if (currentUser?.phone) {
      navigate(`/track-order?orderId=${currentUser.phone}`)
    } else {
      navigate('/track-order')
    }
  }

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-md my-auto rounded-2xl border border-[#E7E2D9] bg-white shadow-2xl shadow-stone-900/20 flex flex-col max-h-[88dvh] overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between border-b border-[#E7E2D9] px-5 sm:px-6 py-4 bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-[#991B33]" />
            <h3 className="font-heading text-base font-bold text-[#1C1917]">
              {currentUser ? 'Client Account & Orders' : isSignUp ? 'Register Importer Account' : 'Client & Importer Sign In'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-[#78716C] hover:bg-[#F0EBE3] hover:text-[#1C1917] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {currentUser ? (
          /* ── LOGGED IN PROFILE VIEW ── */
          <div className="overflow-y-auto p-5 sm:p-6 space-y-5 text-left custom-scrollbar">
            <div className="flex items-center gap-3.5 pb-4 border-b border-[#E7E2D9]">
              <div className="h-12 w-12 rounded-full bg-[#FDF2F4] border border-[#F7CCD5] flex items-center justify-center text-[#991B33] font-bold text-lg overflow-hidden shrink-0">
                {currentUser.avatar_url ? (
                  <img src={currentUser.avatar_url} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  (currentUser.name || 'C').charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-heading text-base font-bold text-[#1C1917] truncate">
                    {currentUser.name}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium shrink-0">
                    Verified
                  </span>
                </div>
                <p className="text-xs text-[#78716C] truncate">{currentUser.email}</p>
                {currentUser.phone && (
                  <p className="text-[11px] text-[#78716C] font-mono">{currentUser.phone}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleViewOrders}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-[#E7E2D9] bg-[#FAF8F5] hover:border-[#991B33]/40 text-xs text-[#1C1917] transition-all cursor-pointer group shadow-xs"
              >
                <span className="flex items-center gap-2.5 font-semibold">
                  <Package className="h-4 w-4 text-[#991B33] group-hover:scale-110 transition-transform" />
                  <span>Track Consignments & Orders</span>
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-[#78716C] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-all cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          </div>
        ) : (
          /* ── SIGN IN / SIGN UP FORM ── */
          <div className="overflow-y-auto p-5 sm:p-6 space-y-4 text-left custom-scrollbar">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs leading-relaxed">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* ── GOOGLE ONE-CLICK SIGN IN ── */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-[#E7E2D9] bg-[#FAF8F5] hover:bg-[#F0EBE3] hover:border-[#991B33]/40 text-[#1C1917] text-xs font-semibold transition-all shadow-xs active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {googleLoading ? (
                <RefreshCw className="w-4 h-4 text-[#991B33] animate-spin" />
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>{isSignUp ? 'Sign up with Google' : 'Continue with Google'}</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-3">
              <div className="w-full border-t border-[#E7E2D9]" />
              <span className="bg-white px-3 text-[10px] uppercase font-bold tracking-widest text-[#78716C] absolute">
                Or with Email
              </span>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-3.5">
              {isSignUp && (
                <div>
                  <label className="block text-[11px] font-semibold text-[#1C1917] mb-1">
                    Your Full Name <span className="text-[#991B33]">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78716C]" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aryan Sharma"
                      className="w-full rounded-xl border border-[#E7E2D9] bg-white pl-10 pr-3.5 py-2.5 text-xs text-[#1C1917] placeholder-stone-400 focus:border-[#991B33] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-[#1C1917] mb-1">
                  Email Address <span className="text-[#991B33]">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78716C]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="buyer@enterprise.com"
                    className="w-full rounded-xl border border-[#E7E2D9] bg-white pl-10 pr-3.5 py-2.5 text-xs text-[#1C1917] placeholder-stone-400 focus:border-[#991B33] focus:outline-none"
                  />
                </div>
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-[11px] font-semibold text-[#1C1917] mb-1">
                    Mobile Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78716C]" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full rounded-xl border border-[#E7E2D9] bg-white pl-10 pr-3.5 py-2.5 text-xs text-[#1C1917] placeholder-stone-400 focus:border-[#991B33] focus:outline-none font-mono"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-[#1C1917] mb-1">
                  Password <span className="text-[#991B33]">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78716C]" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full rounded-xl border border-[#E7E2D9] bg-white pl-10 pr-3.5 py-2.5 text-xs text-[#1C1917] placeholder-stone-400 focus:border-[#991B33] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-3 text-xs font-bold uppercase tracking-wider bg-[#991B33] text-white hover:bg-[#7E1227] shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <span>{isSignUp ? 'Create Importer Account' : 'Sign In to Account'}</span>
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp)
                    setError('')
                    setSuccessMsg('')
                  }}
                  className="text-xs text-[#78716C] hover:text-[#991B33] transition-colors cursor-pointer font-medium"
                >
                  {isSignUp
                    ? 'Already have an account? Sign In'
                    : "Don't have an account? Register now"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent
}
