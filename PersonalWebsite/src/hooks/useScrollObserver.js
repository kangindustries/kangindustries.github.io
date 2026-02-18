import { useEffect } from 'react'

export function useScrollObserver() {
  useEffect(() => {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const el = entry.target
        if (el.classList.contains('section-heading')) {
          el.classList.add('glitch')
        } else {
          el.classList.add('visible')
        }
        obs.unobserve(el)
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' })

    document.querySelectorAll('.card, .panel, .stackbtn').forEach(el => io.observe(el))
    document.querySelectorAll('.section__head h2').forEach(h => {
      h.classList.add('section-heading')
      io.observe(h)
    })

    return () => io.disconnect()
  }, [])
}