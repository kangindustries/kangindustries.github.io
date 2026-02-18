import { useEffect } from 'react'

export default function CertLightbox({ src, alt, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div
      className="cert-lightbox open"
      role="dialog"
      aria-modal="true"
      aria-label="Certificate preview"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <button className="cert-lightbox__close" aria-label="Close" onClick={onClose}>✕</button>
      <img className="cert-lightbox__img" src={src} alt={alt || 'Certificate'} />
    </div>
  )
}