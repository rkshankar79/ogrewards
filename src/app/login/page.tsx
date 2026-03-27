'use client'

const GREEN = '#00d084'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: '#080808' }}>
      {/* Grid bg */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(0,208,132,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,208,132,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(ellipse, #00d084 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="relative z-10 w-full max-w-xs text-center">
        <a href="/" className="inline-flex items-center gap-2 mb-10">
          <span className="h-7 w-7 rounded-lg flex items-center justify-center text-black text-sm font-black" style={{ backgroundColor: GREEN }}>O</span>
          <span className="text-xl font-black text-white">OGRewards</span>
        </a>

        <h1 className="text-2xl font-black text-white mb-2">Who are you?</h1>
        <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>Select to continue</p>

        <div className="space-y-3">
          <a href="/nightphantom"
            className="flex items-center justify-between w-full px-5 py-4 rounded-2xl border font-semibold text-white transition-all hover:border-opacity-60"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.12)' }}>
            <div className="flex items-center gap-3">
              <span className="text-xl">💵</span>
              <div className="text-left">
                <p className="font-bold text-white text-sm">I'm a Customer</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Earn free cash back</p>
              </div>
            </div>
            <span style={{ color: GREEN }}>→</span>
          </a>

          <a href="/admin/login"
            className="flex items-center justify-between w-full px-5 py-4 rounded-2xl border font-semibold text-white transition-all hover:border-opacity-60"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.12)' }}>
            <div className="flex items-center gap-3">
              <span className="text-xl">⚡</span>
              <div className="text-left">
                <p className="font-bold text-white text-sm">I'm a Brand Owner</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Manage rewards portal</p>
              </div>
            </div>
            <span style={{ color: GREEN }}>→</span>
          </a>
        </div>

        <a href="/" className="block mt-8 text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>← Back to home</a>
      </div>
    </div>
  )
}
