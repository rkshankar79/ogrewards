export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="px-6 py-5 border-b border-gray-100">
        <a href="/" className="text-xl font-black tracking-tight text-gray-900">OGRewards</a>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <h1 className="text-3xl font-black text-gray-900 mb-2 text-center">Welcome back</h1>
        <p className="text-gray-500 mb-12 text-center">Choose how you want to sign in</p>

        <div className="grid sm:grid-cols-2 gap-5 w-full max-w-2xl">
          <a href="/nightphantom"
            className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 p-8 transition-all flex flex-col items-center text-center">
            <div className="text-5xl mb-5">🛒</div>
            <h2 className="text-xl font-black text-gray-900 mb-2">I'm a Customer</h2>
            <p className="text-sm text-gray-500 leading-relaxed">Scan receipts and earn cash back on your cannabis purchases.</p>
            <div className="mt-6 px-5 py-2.5 rounded-xl font-bold text-white text-sm" style={{ backgroundColor: '#6d28d9' }}>
              Go to Rewards →
            </div>
          </a>

          <a href="/admin/login"
            className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 p-8 transition-all flex flex-col items-center text-center">
            <div className="text-5xl mb-5">🏢</div>
            <h2 className="text-xl font-black text-gray-900 mb-2">I'm a Brand Owner</h2>
            <p className="text-sm text-gray-500 leading-relaxed">Manage your reward pool, analytics, and payout settings.</p>
            <div className="mt-6 px-5 py-2.5 rounded-xl font-bold text-white text-sm" style={{ backgroundColor: '#1a1a2e' }}>
              Admin Portal →
            </div>
          </a>
        </div>
      </div>

      <p className="text-center text-xs text-gray-300 py-6">Powered by OGRewards</p>
    </div>
  )
}
