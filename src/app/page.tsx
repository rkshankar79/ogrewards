export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-16 py-5 border-b border-gray-100">
        <span className="text-xl font-black tracking-tight">OGRewards</span>
        <div className="flex items-center gap-6">
          <a href="#how" className="hidden md:block text-sm font-medium text-gray-900 hover:opacity-70 transition-opacity">How it works</a>
          <a href="#pricing" className="hidden md:block text-sm font-medium text-gray-900 hover:opacity-70 transition-opacity">Pricing</a>
          <a href="/admin/login" className="hidden md:block text-sm font-medium text-gray-900 hover:opacity-70 transition-opacity">Brand Login</a>
          <a href="mailto:admin@ogrewards.io"
            className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#1a1a2e' }}>
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 md:px-16 pt-20 pb-24 max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-100 text-green-700 text-xs font-semibold mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Now live in Illinois
          </div>
          <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight mb-6">
            Cash-back rewards<br />
            <span className="text-gray-400">for cannabis brands.</span>
          </h1>
          <p className="text-xl text-gray-900 leading-relaxed mb-10 max-w-xl">
            Your customers scan a dispensary receipt. You reward them with real cash. No app downloads. No points. Just money back via Venmo or PayPal.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="mailto:admin@ogrewards.io"
              className="inline-flex items-center justify-center px-7 py-4 rounded-xl font-bold text-white text-base transition-all hover:opacity-90 shadow-lg"
              style={{ backgroundColor: '#1a1a2e' }}>
              Start for free →
            </a>
            <a href="#how"
              className="inline-flex items-center justify-center px-7 py-4 rounded-xl font-bold text-gray-900 text-base border border-gray-200 hover:bg-gray-50 transition-colors">
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="bg-gray-50 border-y border-gray-100 px-6 md:px-16 py-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6">Trusted by</p>
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-black text-sm"
                style={{ backgroundColor: '#6d28d9' }}>
                N
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Night Phantom</p>
                <p className="text-xs text-gray-900">Cannabis · Illinois</p>
              </div>
            </div>
            <div className="flex items-center gap-3 opacity-30">
              <div className="h-10 w-10 rounded-xl bg-gray-300" />
              <div>
                <p className="font-bold text-gray-900 text-sm">Your Brand</p>
                <p className="text-xs text-gray-900">Could be here</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-6 md:px-16 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Dead simple for everyone</h2>
          <p className="text-gray-900 text-lg">No loyalty cards. No app. Works at any dispensary.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* For consumers */}
          <div>
            <p className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6">For your customers</p>
            <div className="space-y-6">
              {[
                { step: '01', title: 'Buy your products', desc: 'Customer purchases at any dispensary carrying your brand.' },
                { step: '02', title: 'Scan the receipt', desc: 'They scan their dispensary receipt using a link from your packaging or store materials.' },
                { step: '03', title: 'Get real cash', desc: 'Reward lands in their Venmo or PayPal. No gift cards, no points — actual money.' },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-5">
                  <span className="text-3xl font-black text-gray-900 leading-none mt-0.5 w-10 flex-shrink-0">{step}</span>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">{title}</p>
                    <p className="text-gray-900 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Phone mockup */}
          <div className="flex justify-center">
            <div className="w-64 rounded-3xl shadow-2xl overflow-hidden border-4 border-gray-900 bg-white">
              <div className="bg-gray-900 px-4 py-2 flex justify-between items-center">
                <span className="text-white text-xs font-bold">9:41</span>
                <div className="flex gap-1">
                  <div className="h-1.5 w-4 bg-white rounded-full opacity-80" />
                  <div className="h-1.5 w-4 bg-white rounded-full opacity-80" />
                </div>
              </div>
              <div className="px-4 pt-6 pb-8" style={{ background: 'linear-gradient(160deg, #6d28d9, #3730a3)' }}>
                <p className="text-white/60 text-xs mb-1">Total Balance</p>
                <p className="text-4xl font-black text-white">$3.75</p>
                <p className="text-white/60 text-xs mt-1">12 scans · 1 brand</p>
              </div>
              <div className="-mt-4 mx-3 rounded-2xl bg-white shadow-lg border border-gray-100 p-4 mb-3">
                <div className="h-1 rounded-full mb-3" style={{ background: 'linear-gradient(90deg, #6d28d9, #6366f1)' }} />
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-black text-xs" style={{ backgroundColor: '#6d28d9' }}>N</div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Night Phantom</p>
                      <p className="text-xs text-purple-600">🏆 Hero</p>
                    </div>
                  </div>
                  <p className="text-lg font-black text-gray-900">$3.75</p>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <div className="h-full rounded-full w-3/4" style={{ background: 'linear-gradient(90deg, #6d28d9, #6366f1)' }} />
                </div>
                <p className="text-xs text-gray-900 mb-3">$3.75 / $5.00 to cash out</p>
                <div className="rounded-xl text-white text-xs font-bold py-2.5 text-center" style={{ backgroundColor: '#6d28d9' }}>
                  📷 Scan Receipt
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reward rates */}
      <section className="bg-gray-50 border-y border-gray-100 px-6 md:px-16 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-3">Real cash. Every scan.</h2>
          <p className="text-gray-900 mb-12">Customers earn per qualifying product on the receipt.</p>
          <div className="grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {[
              { emoji: '💨', product: 'Vapes', rate: '$0.50', desc: 'per unit' },
              { emoji: '🌿', product: 'Pre-rolls', rate: '$0.25', desc: 'per unit' },
              { emoji: '👑', product: 'Legend Bonus', rate: '+50%', desc: 'after 25 scans' },
            ].map(({ emoji, product, rate, desc }) => (
              <div key={product} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="text-3xl mb-3">{emoji}</div>
                <p className="font-bold text-gray-900 text-sm mb-1">{product}</p>
                <p className="text-3xl font-black text-gray-900">{rate}</p>
                <p className="text-sm text-gray-900 mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 md:px-16 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Simple pricing</h2>
          <p className="text-gray-900 text-lg">One-time setup fee + monthly platform fee. You fund your own reward pool.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: 'Starter',
              price: '$99',
              setup: '$299 setup',
              desc: 'Perfect for new brands testing loyalty.',
              features: ['Up to 500 scans/mo', 'Basic analytics', 'Email support', 'Custom brand colors', 'Venmo + PayPal payouts'],
              highlight: false,
            },
            {
              name: 'Growth',
              price: '$199',
              setup: '$299 setup',
              desc: 'For brands ready to scale loyalty.',
              features: ['Up to 2,000 scans/mo', 'Full analytics + reports', 'Priority support', 'Custom domain', 'All payout methods'],
              highlight: true,
            },
            {
              name: 'Pro',
              price: '$399',
              setup: '$299 setup',
              desc: 'Multi-brand or high-volume operations.',
              features: ['Unlimited scans', 'Multi-brand dashboard', 'Dedicated support', 'API access', 'White-label everything'],
              highlight: false,
            },
          ].map(({ name, price, setup, desc, features, highlight }) => (
            <div key={name} className={`rounded-2xl p-7 border ${highlight ? 'border-gray-900 bg-gray-900 text-white shadow-2xl scale-105' : 'border-gray-100 bg-white shadow-sm'}`}>
              <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${highlight ? 'text-gray-300' : 'text-gray-900'}`}>{name}</p>
              <div className="flex items-end gap-1 mb-1">
                <span className={`text-4xl font-black ${highlight ? 'text-white' : 'text-gray-900'}`}>{price}</span>
                <span className={`text-sm mb-1.5 ${highlight ? 'text-gray-300' : 'text-gray-900'}`}>/mo</span>
              </div>
              <p className={`text-xs mb-2 font-medium ${highlight ? 'text-gray-300' : 'text-gray-900'}`}>{setup}</p>
              <p className={`text-sm leading-relaxed mb-6 ${highlight ? 'text-gray-300' : 'text-gray-900'}`}>{desc}</p>
              <ul className="space-y-2.5 mb-8">
                {features.map(f => (
                  <li key={f} className={`text-sm flex items-center gap-2 ${highlight ? 'text-gray-200' : 'text-gray-900'}`}>
                    <span className={`text-xs ${highlight ? 'text-green-400' : 'text-green-600'}`}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="mailto:admin@ogrewards.io"
                className={`block text-center py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 ${highlight ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}`}>
                Get started
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Login clarity section */}
      <section className="bg-gray-50 border-y border-gray-100 px-6 md:px-16 py-16">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-7 shadow-sm">
            <div className="text-3xl mb-4">🛒</div>
            <h3 className="text-lg font-black text-gray-900 mb-2">I'm a customer</h3>
            <p className="text-gray-900 text-sm mb-5">Scan your receipt and earn cash back on Night Phantom products.</p>
            <a href="/nightphantom"
              className="block text-center py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: '#6d28d9' }}>
              Night Phantom Rewards →
            </a>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-7 shadow-sm">
            <div className="text-3xl mb-4">🏢</div>
            <h3 className="text-lg font-black text-gray-900 mb-2">I'm a brand owner</h3>
            <p className="text-gray-900 text-sm mb-5">Manage your reward pool, view scans, and track payouts in the admin portal.</p>
            <a href="/admin/login"
              className="block text-center py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: '#1a1a2e' }}>
              Brand Admin Login →
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-16 py-24" style={{ background: 'linear-gradient(160deg, #1a1a2e, #0f0f1a)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to reward your customers?</h2>
          <p className="text-gray-300 text-lg mb-10">Get set up in days, not months. No technical knowledge required.</p>
          <a href="mailto:admin@ogrewards.io"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-gray-900 text-base bg-white transition-all hover:opacity-90 shadow-xl">
            Email us to get started →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-16 py-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm font-black text-gray-900">OGRewards</span>
        <p className="text-sm text-gray-900">© 2026 OGRewards LLC · Chicago, IL · admin@ogrewards.io</p>
      </footer>

    </div>
  )
}
