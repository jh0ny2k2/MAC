import { useEffect, useState } from 'react'

export default function useCountUp(target, duration = 1000) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const num = Number(target)
    if (!isFinite(num)) {
      setValue(0)
      return
    }

    let raf
    const start = performance.now()

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(num * eased)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return value
}
