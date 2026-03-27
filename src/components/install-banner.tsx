'use client'

import { useEffect, useState } from 'react'

const GREEN = '#00d084'

export default function InstallBanner() {
  const [prompt, setPrompt] = useState<any>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
    setIsIOS(/iphone|ipad|ipod/i.test(navigator.userAgent))
    setDismissed(!!localStorage.getItem('install-dismissed'))

    const handler = (e: Event) => { e.preventDefault(); setPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  function dismiss() {
    localStorage.setItem('install-dismissed', '1')
    setDismissed(true)
  }

  async function install() {
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') dismiss()
  }

  if (isStandalone || dismissed) return null
  if (!prompt && !isIOS) return null

  return (
    <div className="mx-4 mb-4 rounded-2xl border px-4 py-3 flex items-center justify-between gap-3"
      style={{ backgroundColor: 'rgba(0,208,132,0.08)', borderColor: 'rgba(0,208,132,0.25)' }}>
      <div className="flex items-center gap-3">
        <span className="text-xl">📲</span>
        <div>
          <p className="text-sm font-bold text-white">Add to Home Screen</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {isIOS ? 'Tap Share → Add to Home Screen' : 'Install for quick access'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {!isIOS && (
          <button onClick={install}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-black"
            style={{ backgroundColor: GREEN }}>
            Install
          </button>
        )}
        <button onClick={dismiss} className="text-xs px-2 py-1.5 rounded-lg" style={{ color: 'rgba(255,255,255,0.3)' }}>
          ✕
        </button>
      </div>
    </div>
  )
}
