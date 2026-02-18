import { useEffect } from 'react'

export function useCardTilt() {
  useEffect(() => {
    const cards = document.querySelectorAll('.card')

    const handlers = []
    cards.forEach(card => {
      const onMove = (e) => {
        const r = card.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const dx = (e.clientX - cx) / (r.width / 2)
        const dy = (e.clientY - cy) / (r.height / 2)
        card.style.setProperty('--cx', ((e.clientX - r.left) / r.width * 100) + '%')
        card.style.setProperty('--cy', ((e.clientY - r.top) / r.height * 100) + '%')
        card.style.transform = `perspective(600px) rotateY(${dx * 5}deg) rotateX(${-dy * 4}deg) scale(1.01)`
      }
      const onLeave = () => { card.style.transform = '' }
      card.addEventListener('mousemove', onMove)
      card.addEventListener('mouseleave', onLeave)
      handlers.push({ card, onMove, onLeave })
    })

    return () => {
      handlers.forEach(({ card, onMove, onLeave }) => {
        card.removeEventListener('mousemove', onMove)
        card.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])
}