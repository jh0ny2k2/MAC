import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { cx } from '../utils/format'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Volver arriba"
      className={cx(
        'fixed bottom-6 right-6 z-40 flex size-11 items-center justify-center rounded-full border border-carbon-700 bg-carbon-900/90 text-carbon-300 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-f1-500 hover:bg-f1-500 hover:text-white',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
      )}
    >
      <ArrowUp size={18} />
    </button>
  )
}