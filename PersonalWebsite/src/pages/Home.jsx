import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import BootScreen from '../components/BootScreen.jsx'
import CertLightbox from '../components/CertLightbox.jsx'
import ScrollProgress from '../components/ScrollProgress.jsx'
import { useScrollObserver } from '../hooks/useScrollObserver.js'
import knimeCert  from '../assets/knimecert.png'
import udemyCert  from '../assets/udemycert.png'

/* ── Typewriter ── */
function useTypewriter(phrases) {
  const [displayed, setDisplayed] = useState('')
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [charIdx,   setCharIdx]   = useState(0)
  const [deleting,  setDeleting]  = useState(false)
  const [paused,    setPaused]    = useState(false)

  useEffect(() => {
    if (paused) return
    const target = phrases[phraseIdx]
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIdx < target.length) {
          setDisplayed(target.slice(0, charIdx + 1))
          setCharIdx(c => c + 1)
        } else {
          setPaused(true)
          setTimeout(() => { setDeleting(true); setPaused(false) }, 2200)
        }
      } else {
        if (charIdx > 0) {
          setDisplayed(target.slice(0, charIdx - 1))
          setCharIdx(c => c - 1)
        } else {
          setDeleting(false)
          setPhraseIdx(i => (i + 1) % phrases.length)
        }
      }
    }, deleting ? 38 + Math.random() * 28 : 62 + Math.random() * 60)
    return () => clearTimeout(timeout)
  }, [charIdx, deleting, paused, phraseIdx, phrases])

  return displayed
}

/* ── Char-by-char title ── */
function SplitTitle({ children }) {
  const titleRef = useRef(null)
  useEffect(() => {
    const title = titleRef.current
    if (!title) return
    function processNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment()
        ;[...node.textContent].forEach(ch => {
          const span = document.createElement('span')
          span.className = 'char'
          span.textContent = ch === ' ' ? '\u00a0' : ch
          frag.appendChild(span)
        })
        return frag
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        const clone = node.cloneNode(false)
        node.childNodes.forEach(child => clone.appendChild(processNode(child)))
        return clone
      }
      return node.cloneNode(true)
    }
    const frag = document.createDocumentFragment()
    title.childNodes.forEach(child => frag.appendChild(processNode(child)))
    title.innerHTML = ''
    title.appendChild(frag)
    const isWS = v => !v || v.replace(/\u00a0/g, ' ').trim() === ''
    let chars = title.querySelectorAll('.char')
    while (chars[0] && isWS(chars[0].textContent)) { chars[0].remove(); chars = title.querySelectorAll('.char') }
    chars = title.querySelectorAll('.char')
    while (chars[chars.length-1] && isWS(chars[chars.length-1].textContent)) {
      chars[chars.length-1].remove(); chars = title.querySelectorAll('.char')
    }
    title.querySelectorAll('.char').forEach((s, i) => { s.style.animationDelay = `${0.5 + i * 0.04}s` })
  }, [])
  return <h1 className="title" ref={titleRef}>{children}</h1>
}

/* ── Particle canvas (light-mode tinted) ── */
function HeroParticles() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const COUNT = 55
    const CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ'
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize, { passive: true })
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      speed: 0.22 + Math.random() * 0.55,
      char: CHARS[Math.floor(Math.random() * CHARS.length)],
      opacity: 0.04 + Math.random() * 0.10,
      size: 10 + Math.random() * 6, changeTimer: 0,
      isColumn: Math.random() > 0.7,
    }))
    let rafId
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.y += p.speed; p.changeTimer++
        if (p.changeTimer > 38) { p.char = CHARS[Math.floor(Math.random() * CHARS.length)]; p.changeTimer = 0 }
        if (p.y > canvas.height) { p.y = -20; p.x = Math.random() * canvas.width }
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = '#059669'
        ctx.font = `${p.size}px 'DM Mono', monospace`
        ctx.fillText(p.char, p.x, p.y)
        if (p.isColumn) {
          ctx.globalAlpha = p.opacity * 0.22
          ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], p.x, p.y - p.size)
        }
      })
      rafId = requestAnimationFrame(tick)
    }
    tick()
    return () => { cancelAnimationFrame(rafId); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} style={{ position:'absolute',inset:0,width:'100%',height:'100%',zIndex:2,pointerEvents:'none' }}></canvas>
}

/* ── Radar blips ── */
function RadarBlips() {
  const containerRef = useRef(null)
  const statusRef    = useRef(null)
  const coordRef     = useRef(null)
  useEffect(() => {
    const container = containerRef.current
    const statusEl  = statusRef.current
    const coordEl   = coordRef.current
    if (!container || !statusEl) return
    const phrases = [
      'INCIDENT_RESPONSE','NETWORK_SECURITY','IT_AUDITING','DIGITAL_FORENSICS',
      'MALWARE_ANALYSIS','ETHICAL_HACKING','SERVER_ADMINISTRATION',
      'INTRUSION_PREVENTION','SECURE_WEB_APPLICATIONS','THREAT_INTELLIGENCE'
    ]
    const decode = (text) => {
      const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_'
      let i = 0
      const iv = setInterval(() => {
        statusEl.textContent = text.split('').map((ch, idx) =>
          idx < i ? text[idx] : alpha[Math.floor(Math.random() * alpha.length)]
        ).join('')
        if (i >= text.length) clearInterval(iv)
        i += 1/3
      }, 28)
    }
    const spawnBlip = () => {
      const b = document.createElement('div')
      b.className = 'radar-blip'
      const lx = Math.random() * 32 + 58
      const ty = Math.random() * 60 + 10
      b.style.left = lx + '%'; b.style.top = ty + '%'
      container.appendChild(b)
      setTimeout(() => b.remove(), 3500)
      decode(phrases[Math.floor(Math.random() * phrases.length)])
      if (coordEl) coordEl.textContent = `LAT: ${(ty * 0.9 - 45).toFixed(4)}° LON: ${(lx * 3.6 - 180).toFixed(4)}°`
    }
    const t = setTimeout(() => { spawnBlip(); const iv = setInterval(spawnBlip, 4000); return () => clearInterval(iv) }, 3400)
    return () => clearTimeout(t)
  }, [])
  return (
    <>
      <div ref={containerRef}></div>
      <div className="status-text" ref={statusRef}>SYSTEM_IDLE</div>
      <div className="coord-display" ref={coordRef}>LAT: ---.---- LON: ---.----</div>
    </>
  )
}

const TYPEWRITER_PHRASES = [
  'Zero Trust Architecture',
  'Confidentiality, Integrity and Availability',
  'Virtual Private Networks',
  'Encryption and Decryption',
  'Authentication and Authorization',
]

export default function Home() {
  const nameRef   = useRef(null)
  const posterRef = useRef(null)
  const layer1Ref = useRef(null)
  const layer2Ref = useRef(null)
  const [lightbox, setLightbox] = useState(null)
  const typeText = useTypewriter(TYPEWRITER_PHRASES)

  useScrollObserver()

  // Decipher name
  useEffect(() => {
    const el = nameRef.current
    if (!el) return
    const target = 'Yap Kang'
    const chars  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!?'
    let iteration = 0
    el.textContent = target
    const t = setTimeout(() => {
      el.textContent = ''
      const iv = setInterval(() => {
        el.textContent = target.split('').map((ch, idx) => {
          if (idx < iteration) return target[idx]
          return chars[Math.floor(Math.random() * chars.length)]
        }).join('')
        if (iteration >= target.length) clearInterval(iv)
        iteration += 1/4
      }, 40)
    }, 2800)
    return () => clearTimeout(t)
  }, [])

  // Parallax
  useEffect(() => {
    const poster = posterRef.current
    const l1 = layer1Ref.current
    const l2 = layer2Ref.current
    if (!poster) return
    const onMove = (e) => {
      const r = poster.getBoundingClientRect()
      poster.style.setProperty('--mx', (e.clientX - r.left) + 'px')
      poster.style.setProperty('--my', (e.clientY - r.top) + 'px')
      const cx = (e.clientX - r.left) / r.width  - 0.5
      const cy = (e.clientY - r.top)  / r.height - 0.5
      if (l1) l1.style.transform = `translate(${cx * -16}px, ${cy * -10}px)`
      if (l2) l2.style.transform = `translate(${cx * -28}px, ${cy * -18}px)`
    }
    poster.addEventListener('mousemove', onMove)
    return () => poster.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      <ScrollProgress />
      <BootScreen />
      <a className="skip" href="#main">Skip to content</a>
      <Navbar />

      <main id="main" className="page-enter">

        {/* ── HERO ── */}
        <section className="poster" ref={posterRef}>
          <div className="poster__grid"></div>
          <div className="poster__glow"></div>
          <div className="poster__layer" ref={layer1Ref}><div className="poster__orb poster__orb--1"></div></div>
          <div className="poster__layer" ref={layer2Ref}><div className="poster__orb poster__orb--2"></div></div>
          <HeroParticles />
          <RadarBlips />
          <div className="poster__corner poster__corner--tl"></div>
          <div className="poster__corner poster__corner--tr"></div>
          <div className="poster__corner poster__corner--bl"></div>
          <div className="poster__corner poster__corner--br"></div>

          <div className="container poster__inner">
            <SplitTitle>
              Hello, I'm{' '}
              <span ref={nameRef} className="title__accent">Yap Kang</span>
            </SplitTitle>

            <p className="lead" style={{ marginBottom: '0.25rem' }}>
              <span style={{ color:'var(--green)', fontFamily:"'DM Mono',monospace", fontSize:'clamp(13px,1.3vw,16px)', letterSpacing:'0.05em' }}>
                {typeText}<span className="typewriter-cursor"></span>
              </span>
            </p>

            <p className="lead" style={{ animationDelay:'1.3s', marginTop:'1.2rem' }}>
              Welcome to my portfolio! I'm a Year 2 Cybersecurity student at Temasek Polytechnic.
              Here you can find my past projects, blogs and ways you can reach out to me. Have a look!
            </p>

            <div className="actions">
              <Link className="btn" to="/projects">View My Projects</Link>
              <a className="btn btn--secondary" href="#about">Learn More About Me</a>
            </div>

            <div style={{ display:'flex', gap:'14px', marginTop:'28px', opacity:0, animation:'slideUp 0.75s var(--ease-out-expo) 1.9s forwards' }}>
              <a
                href="https://www.linkedin.com/in/yap-kang-b84755304/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                style={{ display:'flex', alignItems:'center', justifyContent:'center', width:40, height:40, borderRadius:8, border:'1px solid var(--border-2)', background:'var(--surface)', color:'var(--text-2)', transition:'border-color 0.2s, color 0.2s, box-shadow 0.2s, transform 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='var(--border-green)'; e.currentTarget.style.color='var(--green)'; e.currentTarget.style.boxShadow='0 0 16px var(--green-glow)'; e.currentTarget.style.transform='translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border-2)'; e.currentTarget.style.color='var(--text-2)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              <a
                href="https://github.com/kangindustries"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                style={{ display:'flex', alignItems:'center', justifyContent:'center', width:40, height:40, borderRadius:8, border:'1px solid var(--border-2)', background:'var(--surface)', color:'var(--text-2)', transition:'border-color 0.2s, color 0.2s, box-shadow 0.2s, transform 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='var(--border-green)'; e.currentTarget.style.color='var(--green)'; e.currentTarget.style.boxShadow='0 0 16px var(--green-glow)'; e.currentTarget.style.transform='translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border-2)'; e.currentTarget.style.color='var(--text-2)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section className="section" id="about">
          <div className="container">
            <div className="about-header-flex">
              <div className="about-text-content">
                <div className="section__head">
                  <h2 className="section-heading-glow">About Me</h2>
                </div>
                <p className="lead lead--sm">
                  I have a strong interest in learning how we can better protect our digital systems and conduct
                  forensic investigations to fight and prevent cybercrime.
                </p>
              </div>
            </div>
            <div className="about-grid">
              <div className="panel">
                <h2 className="h3">Modules Completed:</h2>
                <ul className="list">
                  <li><strong>Ethical Hacking &amp; Intrusion Prevention</strong> — Vulnerability assessments using Metasploit, mapped to MITRE ATT&amp;CK.</li>
                  <li><strong>Forensics in Digital Security</strong> — NTFS, EXT4 and Apple filesystems; file recovery techniques.</li>
                  <li><strong>Server Administration &amp; Security</strong> — Linux server hardening, service configuration and security.</li>
                  <li><strong>Enterprise Networking</strong> — RIP/OSPF routing, DNS, FTP and SSH configuration.</li>
                  <li><strong>Secure Web Applications</strong> — Encryption, authentication, input validation in web systems.</li>
                  <li><strong>Incident Response &amp; Management</strong> — Wireshark traffic analysis, SIEM configuration and threat detection.</li>
                  <li><strong>Network Security</strong> — Firewall and VPN service configuration across network topologies.</li>
                  <li><strong>IT Security Management &amp; Audit</strong> — Machine auditing against CIS benchmarks and compliance frameworks.</li>
                </ul>
              </div>
              <div className="panel">
                <h2 className="h3">Tools &amp; Technologies:</h2>
                <ul className="list">
                  <li><strong>Security Monitoring &amp; Detection</strong> — Wazuh, Wireshark, Snort IDS, Windows Defender Firewall</li>
                  <li><strong>Forensics</strong> — Autopsy, FTK, ExifTool</li>
                  <li><strong>Penetration Testing</strong> — Kali Linux, Metasploit Framework, OWASP ZAP, Burp</li>
                  <li><strong>Networking</strong> — Cisco Packet Tracer, GNS3</li>
                  <li><strong>Programming &amp; Development</strong> — Python, HTML, CSS, SQL</li>
                  <li><strong>Design &amp; Prototyping</strong> — Canva, Figma</li>
                  <li><strong>General Applications</strong> — Word, PowerPoint, Visual Studio Code, GitHub</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── CERTIFICATIONS ── */}
        <section className="section" id="certifications">
          <div className="container">
            <div className="section__head">
              <h2 className="section-heading-glow">Certifications</h2>
            </div>
            <div className="cert-grid">
              <div className="cert-card" onClick={() => setLightbox({ src: knimeCert, alt: 'KNIME Certification' })}>
                <img src={knimeCert} alt="KNIME Certification" className="cert-img" />
                <div className="cert-details">
                  <h3>Basic Proficiency in KNIME Analytics Platform</h3>
                  <p>Issued: Aug 2024 · by KNIME</p>
                </div>
              </div>
              <div className="cert-card" onClick={() => setLightbox({ src: udemyCert, alt: 'Udemy Certification' })}>
                <img src={udemyCert} alt="Udemy Certification" className="cert-img" />
                <div className="cert-details">
                  <h3>The Modern Python Bootcamp</h3>
                  <p>Issued: Nov 2025 · by Udemy</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section className="section" id="contact">
          <div className="container split">
            <div>
              <div className="section__head">
                <h2 className="section-heading-glow">Get in Touch</h2>
              </div>
              <p className="lead lead--sm">
                Feel free to reach out. I'm open to collaborations and discussions,
                especially if you're working on similar projects.
              </p>
              <div className="stack">
                <a className="stackbtn" href="https://www.linkedin.com/in/yap-kang-b84755304/" target="_blank" rel="noopener noreferrer"><span>LinkedIn — Connect with me</span></a>
                <a className="stackbtn" href="mailto:yap.kang@gmail.com"><span>Email — Reach out directly</span></a>
                <a className="stackbtn" href="https://github.com/kangindustries"><span>GitHub</span></a>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
      {lightbox && <CertLightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />}
    </>
  )
}