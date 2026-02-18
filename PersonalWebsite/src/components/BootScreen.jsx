import { useEffect, useRef } from 'react'

const BOOT_LINES = [
  '> KANG_INDUSTRIES OS v3.0.0',
  '> Initializing security modules...',
  '> Loading cryptographic keys... [OK]',
  '> Mounting forensics toolkit... [OK]',
  '> Connecting to threat intel feed... [OK]',
  '> Calibrating SIEM detection rules... [OK]',
  '> All systems operational.',
  '> WELCOME.',
]

export default function BootScreen() {
  const bootRef = useRef(null)

  useEffect(() => {
    const boot = bootRef.current
    if (!boot) return

    if (sessionStorage.getItem('booted')) {
      boot.style.display = 'none'
      return
    }

    const linesEl = boot.querySelector('.boot-lines')
    BOOT_LINES.forEach((text, i) => {
      const div = document.createElement('div')
      div.className = 'boot-line'
      div.style.animationDelay = `${i * 0.2}s`
      if (i === BOOT_LINES.length - 1) {
        div.innerHTML = text + '<span class="boot-cursor"></span>'
      } else {
        div.textContent = text
      }
      linesEl.appendChild(div)
    })

    setTimeout(() => {
      boot.addEventListener('animationend', () => {
        boot.style.display = 'none'
        sessionStorage.setItem('booted', '1')
      }, { once: true })
    }, 2000)
  }, [])

  return (
    <div id="boot-screen" ref={bootRef}>
      <div className="boot-lines"></div>
      <div className="boot-bar-wrap">
        <div className="boot-bar"></div>
      </div>
    </div>
  )
}