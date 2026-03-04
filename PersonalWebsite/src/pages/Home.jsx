import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import BootScreen from '../components/BootScreen.jsx'
import CertLightbox from '../components/CertLightbox.jsx'
import ScrollProgress from '../components/ScrollProgress.jsx'
import { useScrollObserver } from '../hooks/useScrollObserver.js'
import knimeCert from '../assets/knimecert.png'
import udemyCert from '../assets/udemycert.png'

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
    while (chars[chars.length - 1] && isWS(chars[chars.length - 1].textContent)) {
      chars[chars.length - 1].remove(); chars = title.querySelectorAll('.char')
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
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2, pointerEvents: 'none' }}></canvas>
}

/* ── Radar blips ── */
function RadarBlips() {
  const containerRef = useRef(null)
  const statusRef = useRef(null)
  const coordRef = useRef(null)
  useEffect(() => {
    const container = containerRef.current
    const statusEl = statusRef.current
    const coordEl = coordRef.current
    if (!container || !statusEl) return
    const phrases = [
      'INCIDENT_RESPONSE', 'NETWORK_SECURITY', 'IT_AUDITING', 'DIGITAL_FORENSICS',
      'MALWARE_ANALYSIS', 'ETHICAL_HACKING', 'SERVER_ADMINISTRATION',
      'INTRUSION_PREVENTION', 'THREAT_INTELLIGENCE'
    ]
    const decode = (text) => {
      const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_'
      let i = 0
      const iv = setInterval(() => {
        statusEl.textContent = text.split('').map((ch, idx) =>
          idx < i ? text[idx] : alpha[Math.floor(Math.random() * alpha.length)]
        ).join('')
        if (i >= text.length) clearInterval(iv)
        i += 1 / 3
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

const tools = [
  "Kali Linux", "Windows", "Autopsy", "FTK", "MITRE ATT&CK Framework and Navigator", "Cisco Packet Tracer",
  "Wireshark", "Wazuh", "Burp Suite", "OWASP ZAP", "Metasploit", "Nmap", "Canva", "Figma", "VS Code", "GitHub", "Python", "HTML", "CSS", "SQL"
]

const TOOL_FILES = [
  { name: 'wireshark',        perms: '-rwxr-xr-x', size: '14.2M', category: 'monitoring' },
  { name: 'wazuh',            perms: '-rwxr-xr-x', size: '88.1M', category: 'monitoring' },
  { name: 'snort',            perms: '-rwxr-xr-x', size: '6.7M',  category: 'monitoring' },
  { name: 'autopsy',          perms: '-rwxr-xr-x', size: '210M',  category: 'forensics'  },
  { name: 'ftk',              perms: '-rwxr-xr-x', size: '180M',  category: 'forensics'  },
  { name: 'metasploit',       perms: '-rwxr-xr-x', size: '250M',  category: 'pentest'    },
  { name: 'burpsuite',        perms: '-rwxr-xr-x', size: '112M',  category: 'pentest'    },
  { name: 'owasp-zap',        perms: '-rwxr-xr-x', size: '95.4M', category: 'pentest'    },
  { name: 'nmap',             perms: '-rwxr-xr-x', size: '4.8M',  category: 'pentest'    },
  { name: 'packet-tracer',    perms: '-rwxr-xr-x', size: '1.1G',  category: 'networking' },
  { name: 'gns3',             perms: '-rwxr-xr-x', size: '320M',  category: 'networking' },
  { name: 'python',           perms: '-rwxr-xr-x', size: '9.2M',  category: 'dev'        },
  { name: 'html',             perms: '-rwxr-xr-x', size: '9.2M',  category: 'dev'        },
  { name: 'css',              perms: '-rwxr-xr-x', size: '9.2M',  category: 'dev'        },
  { name: 'vscode',           perms: '-rwxr-xr-x', size: '340M',  category: 'dev'        },
  { name: 'github',           perms: '-rwxr-xr-x', size: '18.3M', category: 'dev'        },
  { name: 'canva',            perms: '-rw-r--r--', size: '300M',    category: 'design'     },
  { name: 'figma',            perms: '-rw-r--r--', size: '280M',    category: 'design'     },
  { name: 'kali-linux',       perms: 'drwxr-xr-x', size: '—',     category: 'os'         },
  { name: 'windows',          perms: 'drwxr-xr-x', size: '—',     category: 'os'         },
]

const CAT_COLORS = {
  monitoring: '#60a5fa',
  forensics:  '#a78bfa',
  pentest:    '#f87171',
  networking: '#34d399',
  dev:        '#fbbf24',
  design:     '#f472b6',
  os:         '#94a3b8',
}

function TerminalTools() {
  const [typed, setTyped]       = useState('')
  const [showFiles, setShowFiles] = useState(false)
  const [hoveredTool, setHoveredTool] = useState(null)
  const [filter, setFilter]     = useState('all')
  const termRef = useRef(null)

  const CMD = 'ls -lah /opt/tools/'

  // type the command
  useEffect(() => {
    let i = 0
    const iv = setInterval(() => {
      i++
      setTyped(CMD.slice(0, i))
      if (i >= CMD.length) {
        clearInterval(iv)
        setTimeout(() => setShowFiles(true), 400)
      }
    }, 55)
    return () => clearInterval(iv)
  }, [])

  const categories = ['all', ...new Set(TOOL_FILES.map(t => t.category))]
  const visible = filter === 'all' ? TOOL_FILES : TOOL_FILES.filter(t => t.category === filter)

  return (
    <div className="term-wrap">
      {/* window chrome */}
      <div className="term-titlebar">
        <span className="term-dot term-dot--red" />
        <span className="term-dot term-dot--yellow" />
        <span className="term-dot term-dot--green" />
        <span className="term-title">root@localhost: ~/opt/tools</span>
      </div>

      <div className="term-body" ref={termRef}>
        {/* prompt line */}
        <div className="term-line">
          <span className="term-prompt">root@localhost</span>
          <span className="term-prompt-sep">:</span>
          <span className="term-path">~/opt/tools</span>
          <span className="term-prompt-dollar">$</span>
          <span className="term-cmd">{typed}</span>
          {!showFiles && <span className="term-cursor" />}
        </div>

        {/* output */}
        {showFiles && (
          <>
            <div className="term-line term-line--meta">
              total {TOOL_FILES.length} tools &nbsp;·&nbsp; {categories.length - 1} categories
            </div>

            {/* category filter */}
            <div className="term-filters">
              {categories.map(c => (
                <button
                  key={c}
                  className={`term-filter${filter === c ? ' term-filter--active' : ''}`}
                  onClick={() => setFilter(c)}
                  style={filter === c && c !== 'all' ? { borderColor: CAT_COLORS[c], color: CAT_COLORS[c] } : {}}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="term-line term-line--header">
              <span className="term-col term-col--perms">permissions</span>
              <span className="term-col term-col--size">size</span>
              <span className="term-col term-col--cat">category</span>
              <span className="term-col term-col--name">name</span>
            </div>

            {visible.map((tool, i) => (
              <div
                key={tool.name}
                className={`term-line term-file${hoveredTool === tool.name ? ' term-file--hovered' : ''}`}
                style={{ animationDelay: `${i * 0.04}s` }}
                onMouseEnter={() => setHoveredTool(tool.name)}
                onMouseLeave={() => setHoveredTool(null)}
              >
                <span className="term-col term-col--perms term-perms">{tool.perms}</span>
                <span className="term-col term-col--size term-size">{tool.size}</span>
                <span
                  className="term-col term-col--cat term-cat"
                  style={{ color: CAT_COLORS[tool.category] }}
                >
                  {tool.category}
                </span>
                <span className="term-col term-col--name term-name"
                  style={hoveredTool === tool.name ? { color: CAT_COLORS[tool.category] } : {}}>
                  {tool.name}
                </span>
              </div>
            ))}

            <div className="term-line term-line--prompt2">
              <span className="term-prompt">root@localhost</span>
              <span className="term-prompt-sep">:</span>
              <span className="term-path">~/opt/tools</span>
              <span className="term-prompt-dollar">$</span>
              <span className="term-cursor" />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  const posterRef = useRef(null)
  const layer1Ref = useRef(null)
  const layer2Ref = useRef(null)
  const [lightbox, setLightbox] = useState(null)

  useScrollObserver()

  useEffect(() => {
  const el = document.querySelector(".title__accent")
  if (!el) return

  const t = setTimeout(() => {
    el.classList.add("revealed")
  }, 1650)

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
      const cx = (e.clientX - r.left) / r.width - 0.5
      const cy = (e.clientY - r.top) / r.height - 0.5
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
              Hello, I'm <span className="title__accent">Yap Kang</span>
            </SplitTitle>

            <p className="lead" style={{ animationDelay: '1.3s', marginTop: '1.2rem' }}>
              I'm a Year 2 student at Temasek Polytechnic studying Cybersecurity and Digital Forensics.
            </p>

            <div className="actions">
              <Link className="btn" to="/projects">View My Projects</Link>
              <a className="btn btn--secondary" href="#about">Learn More About Me</a>
            </div>

            <div style={{ display: 'flex', gap: '14px', marginTop: '28px', opacity: 0, animation: 'slideUp 0.75s var(--ease-out-expo) 1.9s forwards' }}>
              <a
                href="https://www.linkedin.com/in/yap-kang-b84755304/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 8, border: '1px solid var(--border-2)', background: 'var(--surface)', color: 'var(--text-2)', transition: 'border-color 0.2s, color 0.2s, box-shadow 0.2s, transform 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-green)'; e.currentTarget.style.color = 'var(--green)'; e.currentTarget.style.boxShadow = '0 0 16px var(--green-glow)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href="https://github.com/kangindustries"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 8, border: '1px solid var(--border-2)', background: 'var(--surface)', color: 'var(--text-2)', transition: 'border-color 0.2s, color 0.2s, box-shadow 0.2s, transform 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-green)'; e.currentTarget.style.color = 'var(--green)'; e.currentTarget.style.boxShadow = '0 0 16px var(--green-glow)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </a>
              <a
                href="mailto:yap.kang@gmail.com"
                aria-label="Email"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  border: '1px solid var(--border-2)',
                  background: 'var(--surface)',
                  color: 'var(--text-2)',
                  transition: 'border-color 0.2s, color 0.2s, box-shadow 0.2s, transform 0.3s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--border-green)'
                  e.currentTarget.style.color = 'var(--green)'
                  e.currentTarget.style.boxShadow = '0 0 16px var(--green-glow)'
                  e.currentTarget.style.transform = 'translateY(-3px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border-2)'
                  e.currentTarget.style.color = 'var(--text-2)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.transform = 'none'
                }}
              >
                <span className="material-symbols-outlined">
                  mail
                </span>
              </a>
            </div>
            <div className="scroll-indicator">
              <a href="#about" className="scroll-link">
                <span className="scroll-text">Scroll</span>
                <span className="material-symbols-outlined scroll-icon">
                  south
                </span>
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
                  I have always been interested in technology for as long as I can remember. Why do computers, apps and networks work in such ways? That curiosity led me to pursue a Diploma in Cybersecurity and Digital Forensics, where I am learning how to better protect digital systems and conduct forensic investigations to fight and prevent cybercrime.
                </p>
                <p className="lead lead--sm" style={{ marginTop: '1rem', animationDelay: '1.4s' }}>
                  I hope to further enhance my cybersecurity skills while progressing through my course and I look forward to contributing to a safer digital world.
                </p>

                <p className="about-signoff">— Yap Kang</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="modules">
          <div className="container">

            <div className="section__head">
              <h2 className="section-heading-glow">Expertise</h2>
            </div>

            <p className="expertise-subtext">
              See what I’ve done in school by expanding the fields below.
            </p>

            <div className="big-accordion">
              <details className="big-item">
                <summary className="big-summary">
                  <span className="big-title">Networking</span>
                  <span className="big-meta">ROUTING // FIREWALLS // IP ADDRESSING</span>
                  <span className="big-icon" aria-hidden="true">+</span>
                </summary>
                <div className="big-content">
                  <p>
                    <strong><u>Tools: Cisco Packet Tracer</u></strong>
                  </p>
                  <p>
                    Configured network topologies ranging from small home networks, to university campuses and WANs.
                    Due to the nature of networks, they have private IP blocks for subnetting and public IP blocks for NAT. Properly subnetting the networks is crucial in limiting IP address wastage.
                  </p>
                  <p>
                    Networks utilise a combination of static and RIP/OSPF routing to ensure high performance and availability.
                  </p>
                  <p>
                    Another crucial aspect of networking is security. Switches and routers are configured to allow only specific devices to SSH inside, and I adhere to best practices by preventing routers from sharing routing information where it is not needed.
                    Features like BPDU Guard and MD5/SHA authentication are implemented to ensure the networks are safe from a wide range of threats.
                  </p>
                </div>
              </details>

              <details className="big-item">
                <summary className="big-summary">
                  <span className="big-title">Digital Forensics</span>
                  <span className="big-meta">FILESYSTEM ANALYSIS // COMPUTER FORENSICS // FORENSICS PROCESSES</span>
                  <span className="big-icon" aria-hidden="true">+</span>
                </summary>
                <div className="big-content">
                  <p>
                    <strong><u>Tools: Autopsy, FTK, ExifTool</u></strong>
                  </p>
                  <p>
                    Analysed a recovered disk containing emails to create a timeline of an incident for better visualisations.
                    Created a relationship diagram to represent connections between the victim and other persons or entities.
                  </p>
                  <p>
                    Maintained proper forensics processes including the chain of custody and maintaining a detailed forensic logbook alongside my teammates.
                  </p>
                </div>
              </details>

              <details className="big-item">
                <summary className="big-summary">
                  <span className="big-title">VAPT</span>
                  <span className="big-meta">ETHICAL HACKING // SECURING WEB APPLICATIONS</span>
                  <span className="big-icon" aria-hidden="true">+</span>
                </summary>
                <div className="big-content">
                  <p>
                    <strong><u>Tools: Metasploit Framework, Kali Linux OS, Burp Suite, OWASP ZAP, Nmap</u></strong>
                  </p>
                  <p>
                    Utilised the Metasploit framework and a Kali Linux VM to document vulnerabilities and remediation strategies found in target systems.
                    Focused on was SQL Injection, one of the most common web vulnerabilities according to OWASP, which gave me relevant exposure to its consequences and why attackers abuse it.
                  </p>
                  <p>
                    Had to assess the severity of the vulnerability found using CVSS, which is the primary method used by many organisations.
                  </p>
                  <p>
                    Responsible for implementing CRUD operations for the Administrator of a web-based marketplace. To ensure zero trust and multiple layers of security, I implemented several OWASP mitigations from the years 2017 to 2021.
                  </p>
                  <p>
                    These mitigations include prepared statements and parameterized queries for Injection, MIME type validation to prevent unrestricted file uploads of any file type,
                    and resource management/input constraints to prevent DoS and resource exhaustion.
                  </p>
                </div>
              </details>

              <details className="big-item">
                <summary className="big-summary">
                  <span className="big-title">Incident Response</span>
                  <span className="big-meta">SIEM // PACKET ANALYSIS</span>
                  <span className="big-icon" aria-hidden="true">+</span>
                </summary>
                <div className="big-content">
                  <p>
                    <strong><u>Tools: Wireshark, Wazuh SIEM, Snort IDS, Kali Linux OS, MITRE ATT&CK, VirusTotal</u></strong>
                  </p>
                  <p>
                    Experienced in using Wireshark to analyse network traffic.
                    Using my extensive knowledge about Indicators of Compromise (IOCs), I am able to identify malicious traffic, such as Trickbot, Dridex and Qakbot infections to help respond and prevent future incidents.
                    In addition, I am able to link them back to the MITRE ATT&CK framework and categorise them using tools such as the MITRE ATT&CK Navigator.
                  </p>
                  <p>
                    Responsible for conducting data exfiltration using a technique of my choice.
                    The technique chosen was exfiltration via webhook. Using Windows Powershell and a reverse shell, the attacker can extract a file of their choice from the victim machine.
                    Conducted research into remediation and mitigation strategies for such a technique.
                  </p>
                </div>
              </details>

              <details className="big-item">
                <summary className="big-summary">
                  <span className="big-title">Auditing</span>
                  <span className="big-meta">IT AUDITING // BASH SCRIPTING // RESEARCH</span>
                  <span className="big-icon" aria-hidden="true">+</span>
                </summary>
                <div className="big-content">
                  <div className="work-gallery">

                    <figure className="work-shot">
                      <img src={udemyCert} alt="Udemy course certificate" loading="lazy" />
                      <figcaption>Example: Course completion</figcaption>
                    </figure>
                  </div>
                  <p>
                    Contributed to an auditing playbook for HIPAA, a U.S law that protects patient health information. Conducted research into how AI affects HIPAA auditing.
                    The research covered emerging risks of AI, including cybersecurity threats, and how AI can be useful as a tool to provide continuous monitoring, enhances access controls and detect anomalies.
                    Provided steps, recommendations and advice for organisations planning to implement AI systems.
                  </p>
                  <p>
                    Audited a virtual machine in accordance to the CIS benchmarks, and explained the importance for certain configurations.
                  </p>
                </div>
              </details>

              <details className="big-item">
                <summary className="big-summary">
                  <span className="big-title">Others</span>
                  <span className="big-icon" aria-hidden="true">+</span>
                </summary>
                <div className="big-content">
                  <p>
                    In addition to the tools and technologies listed above, I am also familiar with:
                    <ul>
                      <li>Canva and Figma (for Prototyping)</li>
                      <li>Python, HTML and CSS (for Programming and Development).</li>
                      <li>Visual Studio Code and GitHub (for Workflow)</li>
                    </ul>
                  </p>
                </div>
              </details>

            </div>
          </div>
        </section>

        {/* ── TOOLS ── */}
<section className="section" id="tools">
  <div className="container">
    <TerminalTools />
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
                You can find my socials and reach out to me using the links below.
                I'm open to collaborations and discussions, and respond to any emails as quickly as I can.
              </p>
              <div className="stack">
                <a className="stackbtn" href="https://www.linkedin.com/in/yap-kang-b84755304/" target="_blank" rel="noopener noreferrer"><span>LinkedIn — Connect with me</span></a>
                <a className="stackbtn" href="mailto:yap.kang@gmail.com"><span>Email — Reach out directly</span></a>
                <a className="stackbtn" href="https://github.com/kangindustries"><span>GitHub — Let's collaborate</span></a>
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