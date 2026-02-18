import { useEffect, useRef } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import ScrollProgress from '../components/ScrollProgress.jsx'
import { useScrollObserver } from '../hooks/useScrollObserver.js'
import { useCardTilt } from '../hooks/useCardTilt.js'

/* ── Char-by-char title (same as Home) ── */
function SplitTitle({ children, className = '' }) {
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
    title.querySelectorAll('.char').forEach((s, i) => { s.style.animationDelay = `${0.05 + i * 0.045}s` })
  }, [])
  return <h1 className={`title title--sm ${className}`} ref={titleRef}>{children}</h1>
}

export default function Projects() {
  useScrollObserver()
  useCardTilt()

  return (
    <>
      <ScrollProgress />
      <a className="skip" href="#main">Skip to content</a>
      <Navbar />

      <main id="main" className="section page-enter">
        <div className="container">
          <div className="section__head">
            <div>
              <span className="section__label page-title-reveal">// PROJECTS LOADING...</span>
              <SplitTitle>Projects</SplitTitle>
              <p className="lead lead--sm page-desc-reveal">
                A list of past projects I have completed, along with relevant code and documentation.
              </p>
            </div>
          </div>

          <div className="grid grid--cards">

            <article className="card" id="sysmon">
              <div className="card-border"></div>
              <div className="card__top">
                <div>
                  <h2 className="h3">Sysmon + Wazuh Detection Pack</h2>
                  <p className="muted" style={{ fontSize: '12px', marginTop: '4px', fontFamily: 'var(--mono)' }}>Dec 2025 · Detection Engineering</p>
                </div>
                <div className="tags">
                  <span className="tag">Windows</span>
                  <span className="tag">Wazuh</span>
                  <span className="tag">Sysmon</span>
                  <span className="tag">SIEM</span>
                </div>
              </div>
              <p className="card__body">
                <strong>Problem:</strong> Generic Wazuh rules generate excessive false positives in lab environments.<br />
                <strong>Solution:</strong> Custom Sysmon config + 15 tuned rules targeting credential dumping, lateral movement, persistence.<br />
                <strong>Telemetry:</strong> Event IDs 1, 3, 7, 10, 11, 13, 22 with specific field filtering and parent process validation.<br />
                <strong>Validation:</strong> Tested against Atomic Red Team scenarios with documented true/false positive rates.
              </p>
              <div className="card__actions">
                <a className="link" href="#">GitHub Repository →</a>
                <a className="link" href="#">Full Writeup →</a>
              </div>
            </article>

            <article className="card" id="username">
              <div className="card-border"></div>
              <div className="card__top">
                <div>
                  <h2 className="h3">Username Availability Checker</h2>
                  <p className="muted" style={{ fontSize: '12px', marginTop: '4px', fontFamily: 'var(--mono)' }}>Jan 2026 · Web Development</p>
                </div>
                <div className="tags">
                  <span className="tag">JavaScript</span>
                  <span className="tag">Ethics</span>
                  <span className="tag">Privacy</span>
                </div>
              </div>
              <p className="card__body">
                <strong>Challenge:</strong> Check username availability across platforms without violating ToS or rate limits.<br />
                <strong>Approach:</strong> Client-side only, users manually verify platforms, results cached locally, no backend tracking.<br />
                <strong>Ethics:</strong> No automated scraping, respects robots.txt, transparent limitations, privacy-first design.<br />
                <strong>Stack:</strong> Vanilla JavaScript, localStorage caching, responsive UI.
              </p>
              <div className="card__actions">
                <a className="link" href="#">Source Code →</a>
                <a className="link" href="#">Live Demo →</a>
              </div>
            </article>

            <article className="card">
              <div className="card-border"></div>
              <div className="card__top">
                <div>
                  <h2 className="h3">Memory Forensics CTF Writeups</h2>
                  <p className="muted" style={{ fontSize: '12px', marginTop: '4px', fontFamily: 'var(--mono)' }}>Nov 2025 · DFIR</p>
                </div>
                <div className="tags">
                  <span className="tag">Volatility</span>
                  <span className="tag">Memory Analysis</span>
                  <span className="tag">CTF</span>
                </div>
              </div>
              <p className="card__body">
                <strong>Scenarios:</strong> 8 memory dumps from TryHackMe and HackTheBox challenges.<br />
                <strong>Techniques:</strong> Process listing, DLL injection detection, network connections, registry hive analysis, malware carving.<br />
                <strong>Documentation:</strong> Commands used, plugin outputs, investigation paths, dead ends included.<br />
                <strong>Learning:</strong> pslist vs psscan, process hollowing in memory, timeline reconstruction.
              </p>
              <div className="card__actions">
                <a className="link" href="#">View Writeups →</a>
              </div>
            </article>

          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}