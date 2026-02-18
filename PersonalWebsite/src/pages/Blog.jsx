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

export default function Blog() {
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
              <span className="section__label page-title-reveal">// BLOG LOADING...</span>
              <SplitTitle>Blog</SplitTitle>
              <p className="lead lead--sm page-desc-reveal">
                A personal blog where I can share my thoughts and research on tech.
              </p>
            </div>
          </div>

          <div className="grid grid--cards">

            <article className="card" id="linux">
              <div className="card-border"></div>
              <div className="card__top">
                <div>
                  <h2 className="h3">Linux Hardening Checklist</h2>
                  <p className="muted" style={{ fontSize: '12px', marginTop: '4px', fontFamily: 'var(--mono)' }}>12 Jan 2026 · 8 min read</p>
                </div>
                <div className="tags">
                  <span className="tag">Permissions</span>
                  <span className="tag">Logging</span>
                  <span className="tag">Audit</span>
                </div>
              </div>
              <p className="card__body">
                Why each CIS Benchmark setting matters and how to verify it. Covers filesystem partitioning,
                auditd configuration, SSH hardening, and cron permissions with commands you can actually run.
                Includes before/after validation steps and common misconfigurations to avoid.
              </p>
              <div className="card__actions">
                <a className="link" href="#">Read article →</a>
              </div>
            </article>

            <article className="card">
              <div className="card-border"></div>
              <div className="card__top">
                <div>
                  <h2 className="h3">Web Security Fundamentals</h2>
                  <p className="muted" style={{ fontSize: '12px', marginTop: '4px', fontFamily: 'var(--mono)' }}>8 Jan 2026 · 10 min read</p>
                </div>
                <div className="tags">
                  <span className="tag">CSRF</span>
                  <span className="tag">XSS</span>
                  <span className="tag">Cookies</span>
                </div>
              </div>
              <p className="card__body">
                Mental models for common web vulnerabilities with practical examples. How to test safely in
                controlled environments, what actually breaks in production systems, and common mistakes even
                experienced developers make when implementing security controls.
              </p>
              <div className="card__actions">
                <a className="link" href="#">Read article →</a>
              </div>
            </article>

            <article className="card">
              <div className="card-border"></div>
              <div className="card__top">
                <div>
                  <h2 className="h3">Sysmon Event ID Quick Reference</h2>
                  <p className="muted" style={{ fontSize: '12px', marginTop: '4px', fontFamily: 'var(--mono)' }}>5 Jan 2026 · 6 min read</p>
                </div>
                <div className="tags">
                  <span className="tag">Sysmon</span>
                  <span className="tag">Windows</span>
                  <span className="tag">Cheatsheet</span>
                </div>
              </div>
              <p className="card__body">
                Event IDs 1-23 explained with actual use cases and detection scenarios. When to prioritize
                process creation vs network connections, plus filtering tips to reduce volume without missing
                threats. Includes sample detection rules and false positive mitigation strategies.
              </p>
              <div className="card__actions">
                <a className="link" href="#">Read article →</a>
              </div>
            </article>

          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}