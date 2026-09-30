import { useState, useEffect } from 'react'

export default function Countdown({ targetDate, textColor = '#fff', mutedColor = 'rgba(255,255,255,0.5)' }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 })

  useEffect(() => {
    if (!targetDate) return
    const normalized = targetDate.replace(/(\d+)\s+de\s+(\w+)\s+de\s+(\d+)/, (_, d, m, y) => {
      const months = { enero:0, febrero:1, marzo:2, abril:3, mayo:4, junio:5, julio:6, agosto:7, septiembre:8, octubre:9, noviembre:10, diciembre:11 }
      return `${y}-${months[m.toLowerCase()]}-${d}`
    })
    const target = new Date(normalized)
    if (isNaN(target.getTime())) return

    const tick = () => {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) return
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
      })
    }
    tick()
    const id = setInterval(tick, 60000)
    return () => clearInterval(id)
  }, [targetDate])

  return (
    <div className="flex gap-6 justify-center">
      {[
        { label: 'Días', value: timeLeft.days },
        { label: 'Horas', value: timeLeft.hours },
        { label: 'Minutos', value: timeLeft.minutes },
      ].map((t) => (
        <div key={t.label} className="text-center">
          <div className="text-2xl sm:text-3xl font-bold tracking-wider" style={{ color: textColor }}>
            {String(t.value).padStart(2, '0')}
          </div>
          <div className="text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: mutedColor }}>
            {t.label}
          </div>
        </div>
      ))}
    </div>
  )
}
