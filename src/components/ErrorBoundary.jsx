import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Scope Internationals UI Exception:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full rounded-2xl border border-[#E7E2D9] bg-white p-8 shadow-xl space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#991B33]/10 border border-[#991B33]/30 flex items-center justify-center text-[#991B33] font-bold text-xl">
              !
            </div>
            <h2 className="font-heading text-lg font-bold text-[#1C1917]">Notice</h2>
            <p className="text-xs text-[#78716C] leading-relaxed">
              A temporary issue occurred while loading this view. Click below to continue.
            </p>
            {this.state.error?.message && (
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] text-[11px] text-rose-600 font-mono text-left break-words">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="w-full rounded-xl py-3 text-xs font-bold uppercase tracking-wider shadow-md bg-[#991B33] text-white hover:bg-[#7E1227] shadow-[#991B33]/20 cursor-pointer mt-2"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
