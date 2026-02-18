import { useEffect, useRef } from 'react'

export default function AudioVisualizer() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const BAR_COUNT = 64
    const bars = Array.from({ length: BAR_COUNT }, () => ({
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.8,
      base:  0.05 + Math.random() * 0.15,
      amp:   0.12 + Math.random() * 0.28,
    }))

    let t = 0
    let rafId
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      t += 0.018

      const barW  = canvas.width / BAR_COUNT
      const maxH  = canvas.height * 0.88

      bars.forEach((b, i) => {
        const wave =
          Math.sin(t * b.speed + b.phase) * 0.5 +
          Math.sin(t * b.speed * 1.7 + b.phase * 1.3) * 0.3 +
          Math.sin(t * b.speed * 0.5 + b.phase * 0.7) * 0.2

        const h = Math.max(3, (b.base + b.amp * (0.5 + wave * 0.5)) * maxH)
        const x = i * barW + barW * 0.15
        const w = barW * 0.7
        const y = canvas.height - h

        const grad = ctx.createLinearGradient(0, y, 0, canvas.height)
        grad.addColorStop(0, `rgba(52,211,153,${0.7 + wave * 0.3})`)
        grad.addColorStop(0.6, `rgba(52,211,153,0.25)`)
        grad.addColorStop(1, `rgba(52,211,153,0.05)`)

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.roundRect(x, y, w, h, [3, 3, 0, 0])
        ctx.fill()

        if (h > maxH * 0.45) {
          ctx.save()
          ctx.shadowColor = 'rgba(52,211,153,0.7)'
          ctx.shadowBlur  = 12
          ctx.fillStyle   = `rgba(52,211,153,${(h / maxH - 0.45) * 0.5})`
          ctx.beginPath()
          ctx.roundRect(x, y, w, h, [3, 3, 0, 0])
          ctx.fill()
          ctx.restore()
        }
      })

      rafId = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas id="audio-viz" ref={canvasRef}></canvas>
}