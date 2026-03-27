import MarketingNav from '@/components/marketing-nav'

const GREEN = '#00d084'

export default function HomePage() {
  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#080808', color: '#fff' }}>

      {/* Grid background */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(0,208,132,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,208,132,0.04) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(ellipse, #00d084 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="relative z-10">
        <MarketingNav />

        {/* Hero */}
        <section className="px-6 md:px-16 pt-24 pb-32 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight mb-6">
                Bypass the POS.<br />
                <span style={{ color: GREEN }}>Reward OGs</span><br />
                Directly.
              </h1>
              <p className="text-lg leading-relaxed mb-6 max-w-lg" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Boost loyalty and increase sales with seamless direct-to-customer cash rewards. No complex POS integration required. Customers scan a receipt, you reward them via Venmo or PayPal.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 border"
                style={{ borderColor: 'rgba(0,208,132,0.3)', color: GREEN, backgroundColor: 'rgba(0,208,132,0.08)' }}>
                ✓ Always free for your customers
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="mailto:admin@ogrewards.io"
                  className="inline-flex items-center justify-center px-7 py-4 rounded-full font-bold text-black text-base transition-all hover:opacity-90"
                  style={{ backgroundColor: GREEN }}>
                  Get Started →
                </a>
                <a href="#how"
                  className="inline-flex items-center justify-center px-7 py-4 rounded-full font-bold text-base border transition-colors hover:bg-white/5"
                  style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }}>
                  Request Demo
                </a>
              </div>
            </div>

            {/* Phone mockup */}
            <div className="flex justify-center">
              <div className="relative">
                {/* Glow behind phone */}
                <div className="absolute inset-0 rounded-full opacity-30 blur-3xl"
                  style={{ backgroundColor: GREEN, transform: 'scale(0.8)' }} />

                <div className="relative w-64 rounded-3xl shadow-2xl overflow-hidden border-2" style={{ borderColor: 'rgba(255,255,255,0.15)', backgroundColor: '#111' }}>
                  {/* Status bar */}
                  <div className="px-4 py-2 flex justify-between items-center" style={{ backgroundColor: '#0a0a0a' }}>
                    <span className="text-white text-xs font-bold">9:41</span>
                    <div className="flex gap-1">
                      <div className="h-1.5 w-4 rounded-full opacity-80" style={{ backgroundColor: GREEN }} />
                      <div className="h-1.5 w-3 rounded-full opacity-40" style={{ backgroundColor: GREEN }} />
                    </div>
                  </div>
                  {/* App header */}
                  <div className="px-4 pt-6 pb-8" style={{ background: `linear-gradient(160deg, #1a0a2e, #0a1a0e)` }}>
                    <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Total Balance</p>
                    <p className="text-4xl font-black text-white">$3.75</p>
                    <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>12 scans · 1 brand</p>
                  </div>
                  {/* Wallet card */}
                  <div className="-mt-4 mx-3 rounded-2xl shadow-lg border p-4 mb-3" style={{ backgroundColor: '#1a1a1a', borderColor: 'rgba(255,255,255,0.1)' }}>
                    <div className="h-1 rounded-full mb-3" style={{ background: `linear-gradient(90deg, ${GREEN}, #6366f1)` }} />
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-black text-xs" style={{ backgroundColor: '#6d28d9' }}>N</div>
                        <div>
                          <p className="text-xs font-bold text-white">Night Phantom</p>
                          <p className="text-xs" style={{ color: GREEN }}>🏆 Hero</p>
                        </div>
                      </div>
                      <p className="text-lg font-black text-white">$3.75</p>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden mb-2" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                      <div className="h-full rounded-full w-3/4" style={{ background: `linear-gradient(90deg, ${GREEN}, #6366f1)` }} />
                    </div>
                    <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>$3.75 / $5.00 to cash out</p>
                    <div className="rounded-xl text-black text-xs font-bold py-2.5 text-center" style={{ backgroundColor: GREEN }}>
                      📷 Scan Receipt
                    </div>
                  </div>
                </div>

                {/* Receipt floating */}
                <div className="absolute -bottom-4 -right-8 bg-white rounded-xl shadow-xl p-3 w-32 border border-gray-100 rotate-6">
                  <div className="h-1.5 w-full bg-gray-100 rounded mb-1.5" />
                  <div className="h-1.5 w-4/5 bg-gray-100 rounded mb-1.5" />
                  <div className="h-1.5 w-3/5 bg-gray-100 rounded mb-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Total</span>
                    <span className="text-xs font-black text-gray-900">$42.00</span>
                  </div>
                  <div className="mt-1.5 rounded text-center text-white text-xs font-bold py-1" style={{ backgroundColor: GREEN }}>✓ Verified</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted by */}
        <section id="brands" className="border-y px-6 md:px-16 py-10" style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
          <div className="max-w-6xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: 'rgba(255,255,255,0.3)' }}>Trusted by</p>
            <div className="flex flex-wrap items-center gap-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ backgroundColor: '#6d28d9' }}>N</div>
                <div>
                  <p className="font-bold text-white text-sm">Night Phantom</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Cannabis · Illinois</p>
                </div>
              </div>
              <div className="flex items-center gap-3 opacity-25">
                <div className="h-10 w-10 rounded-xl border border-white/20" />
                <div>
                  <p className="font-bold text-white text-sm">Your Brand</p>
                  <p className="text-xs text-white/40">Could be here</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="px-6 md:px-16 py-24 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GREEN }}>How it works</p>
            <h2 className="text-3xl md:text-4xl font-black mb-4">Dead simple for everyone</h2>
            <p className="text-lg" style={{ color: 'rgba(255,255,255,0.5)' }}>No loyalty cards. No app download. Works at any dispensary.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Buy your products', desc: 'Customer purchases at any dispensary carrying your brand. No special POS needed.', icon: '🛒' },
              { step: '02', title: 'Scan the receipt', desc: 'They visit your rewards link and snap a photo of their dispensary receipt. AI does the rest.', icon: '📷' },
              { step: '03', title: 'Get real cash', desc: 'Reward lands in their Venmo or PayPal within minutes. No gift cards, no points — actual money.', icon: '💸' },
            ].map(({ step, title, desc, icon }) => (
              <div key={step} className="rounded-2xl border p-7 transition-all hover:border-opacity-50"
                style={{ borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{icon}</span>
                  <span className="text-xs font-black" style={{ color: GREEN }}>{step}</span>
                </div>
                <h3 className="font-black text-lg text-white mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Reward rates */}
        <section className="border-y px-6 md:px-16 py-20" style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(0,208,132,0.03)' }}>
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GREEN }}>Reward rates</p>
            <h2 className="text-3xl font-black mb-3">Real cash. Every scan.</h2>
            <p className="mb-12" style={{ color: 'rgba(255,255,255,0.5)' }}>Customers earn per qualifying product on the receipt.</p>
            <div className="grid sm:grid-cols-3 gap-5 max-w-2xl mx-auto">
              {[
                { emoji: '💨', product: 'Vapes', rate: '$0.50', desc: 'per unit' },
                { emoji: '🌿', product: 'Pre-rolls', rate: '$0.25', desc: 'per unit' },
                { emoji: '👑', product: 'Legend Bonus', rate: '+50%', desc: 'after 25 scans' },
              ].map(({ emoji, product, rate, desc }) => (
                <div key={product} className="rounded-2xl border p-6"
                  style={{ borderColor: 'rgba(0,208,132,0.2)', backgroundColor: 'rgba(0,208,132,0.05)' }}>
                  <div className="text-3xl mb-3">{emoji}</div>
                  <p className="font-bold text-sm mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>{product}</p>
                  <p className="text-3xl font-black text-white">{rate}</p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="px-6 md:px-16 py-24 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GREEN }}>Pricing</p>
            <h2 className="text-3xl md:text-4xl font-black mb-4">Simple, transparent pricing</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>One-time setup + monthly platform fee. You fund your own reward pool.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Starter', price: '$99', setup: '$299 setup', desc: 'Perfect for new brands testing loyalty.',
                features: ['Up to 500 scans/mo', 'Basic analytics', 'Email support', 'Custom brand colors', 'Venmo + PayPal payouts'],
                highlight: false,
              },
              {
                name: 'Growth', price: '$199', setup: '$299 setup', desc: 'For brands ready to scale loyalty.',
                features: ['Up to 2,000 scans/mo', 'Full analytics + reports', 'Priority support', 'Custom domain', 'All payout methods'],
                highlight: true,
              },
              {
                name: 'Pro', price: '$399', setup: '$299 setup', desc: 'Multi-brand or high-volume operations.',
                features: ['Unlimited scans', 'Multi-brand dashboard', 'Dedicated support', 'API access', 'White-label everything'],
                highlight: false,
              },
            ].map(({ name, price, setup, desc, features, highlight }) => (
              <div key={name} className="rounded-2xl border p-7 flex flex-col"
                style={{
                  borderColor: highlight ? GREEN : 'rgba(255,255,255,0.1)',
                  backgroundColor: highlight ? 'rgba(0,208,132,0.07)' : 'rgba(255,255,255,0.03)',
                  boxShadow: highlight ? `0 0 40px rgba(0,208,132,0.15)` : 'none',
                }}>
                {highlight && (
                  <div className="text-xs font-bold px-3 py-1 rounded-full self-start mb-4 text-black" style={{ backgroundColor: GREEN }}>Most Popular</div>
                )}
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>{name}</p>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-4xl font-black text-white">{price}</span>
                  <span className="text-sm mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>/mo</span>
                </div>
                <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>{setup}</p>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>{desc}</p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {features.map(f => (
                    <li key={f} className="text-sm flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      <span style={{ color: GREEN }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="mailto:admin@ogrewards.io"
                  className="block text-center py-3 rounded-full font-bold text-sm transition-all hover:opacity-90"
                  style={highlight ? { backgroundColor: GREEN, color: '#000' } : { borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', borderStyle: 'solid' }}>
                  Get started
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 md:px-16 py-24 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to reward your customers?</h2>
            <p className="text-lg mb-10" style={{ color: 'rgba(255,255,255,0.5)' }}>Get set up in days, not months. No technical knowledge required.</p>
            <a href="mailto:admin@ogrewards.io"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-black text-base transition-all hover:opacity-90"
              style={{ backgroundColor: GREEN }}>
              Email us to get started →
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 md:px-16 py-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <span className="text-sm font-black text-white flex items-center gap-2">
            <span className="h-5 w-5 rounded flex items-center justify-center text-black text-xs font-black" style={{ backgroundColor: GREEN }}>O</span>
            OGRewards
          </span>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>© 2026 OGRewards LLC · Chicago, IL · admin@ogrewards.io</p>
        </footer>
      </div>
    </div>
  )
}
