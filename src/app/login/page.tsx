const GREEN = '#00d084'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#080808' }}>
      {/* Grid bg */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(0,208,132,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,208,132,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(ellipse, #00d084 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <nav className="relative z-10 px-6 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <a href="/" className="inline-flex items-center gap-2">
          <span className="h-7 w-7 rounded-lg flex items-center justify-center text-black text-sm font-black" style={{ backgroundColor: GREEN }}>O</span>
          <span className="text-xl font-black text-white">OGRewards</span>
        </a>
      </nav>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16">
        <h1 className="text-3xl font-black text-white mb-2 text-center">Welcome back</h1>
        <p className="mb-12 text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>Choose how you want to sign in</p>

        <div className="grid sm:grid-cols-2 gap-5 w-full max-w-2xl">
          <a href="/nightphantom"
            className="rounded-2xl border p-8 flex flex-col items-center text-center transition-all hover:border-opacity-60"
            style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.06)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.03)'}>
            <div className="text-5xl mb-5">🛒</div>
            <h2 className="text-xl font-black text-white mb-2">I'm a Customer</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>Scan receipts and earn cash back on your cannabis purchases.</p>
            <div className="mt-6 px-5 py-2.5 rounded-full font-bold text-black text-sm" style={{ backgroundColor: GREEN }}>
              Go to Rewards →
            </div>
          </a>

          <a href="/admin/login"
            className="rounded-2xl border p-8 flex flex-col items-center text-center transition-all"
            style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.06)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.03)'}>
            <div className="text-5xl mb-5">🏢</div>
            <h2 className="text-xl font-black text-white mb-2">I'm a Brand Owner</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>Manage your reward pool, analytics, and payout settings.</p>
            <div className="mt-6 px-5 py-2.5 rounded-full font-bold text-sm border" style={{ borderColor: GREEN, color: GREEN }}>
              Admin Portal →
            </div>
          </a>
        </div>
      </div>

      <p className="relative z-10 text-center text-xs py-6" style={{ color: 'rgba(255,255,255,0.2)' }}>Powered by OGRewards</p>
    </div>
  )
}
