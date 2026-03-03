import { useEffect, useRef } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import ScrollProgress from '../components/ScrollProgress.jsx'
import { useScrollObserver } from '../hooks/useScrollObserver.js'

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
    title.querySelectorAll('.char').forEach((s, i) => { s.style.animationDelay = `${0.05 + i * 0.045}s` })
  }, [])
  return <h1 className="title title--sm" ref={titleRef}>{children}</h1>
}

export default function Projects() {
  useScrollObserver()

  return (
    <>
      <ScrollProgress />
      <a className="skip" href="#main">Skip to content</a>
      <Navbar />

      <main id="main" className="section page-enter">
        <div className="container">
          <div className="section__head">
            <div>
              <span className="section__label page-title-reveal">// PERSONAL PROJECTS LOADING...</span>
              <SplitTitle>Personal Projects</SplitTitle>
              <p className="lead lead--sm page-desc-reveal">
                A list of my personal projects, along with relevant code and documentation. Some of which are still being updated and worked on.
              </p>
            </div>
          </div>

          <div className="grid grid--cards">

            <article className="card" id="sysmon">
              <div className="card-border"></div>
              <div className="card__top">
                <div>
                  <h2 className="h3">PasswordBiotics</h2>
                  <p className="muted" style={{ fontSize: '12px', marginTop: '4px', fontFamily: 'var(--mono)' }}>Nov 2025</p>
                </div>
                <div className="tags">
                  <span className="tag">Python</span>
                  <span className="tag">HTML</span>
                </div>
              </div>
              <p className="card__body">
                PasswordBiotics is a flask-based password evaluation tool using the zxcvbn library. In addition, it incorporates blacklist detection using a list of 1000 commonly used passwords and leetspeak normalization to enhance the robustness of the tool.
              </p>
              <div className="card__actions">
                <a className="link" href="https://github.com/kangindustries/PasswordBiotics">GitHub Repository →</a>
              </div>
            </article>

            <article className="card" id="username">
              <div className="card-border"></div>
              <div className="card__top">
                <div>
                  <h2 className="h3">Identifile</h2>
                  <p className="muted" style={{ fontSize: '12px', marginTop: '4px', fontFamily: 'var(--mono)' }}>Jan 2026</p>
                </div>
                <div className="tags">
                  <span className="tag">Python</span>
                  <span className="tag">HTML</span>
                </div>
              </div>
              <p className="card__body">
                Identifile is a file-type identification tool that uses a file's "magic number", also known as a signature, to identify its real format, regardless of the file extension or name.
              </p>
              <div className="card__actions">
                <a className="link" href="https://github.com/kangindustries/Identifile">Github Repository →</a>
              </div>
            </article>

            <article className="card">
              <div className="card-border"></div>
              <div className="card__top">
                <div>
                  <h2 className="h3">Serpent</h2>
                  <p className="muted" style={{ fontSize: '12px', marginTop: '4px', fontFamily: 'var(--mono)' }}>Feb 2026</p>
                </div>
                <div className="tags">
                  <span className="tag">Test</span>
                  <span className="tag">Test</span>
                  <span className="tag">Test</span>
                </div>
              </div>
              <p className="card__body">
                Serpent is a malware scanner that uses YARA rules originally developed by VirusTotal to detect the presence of malicious software.
                YARA rules are considered gold standard in detecting patterns commonly found in malicious software.
              </p>
              <div className="card__actions">
                <a className="link" href="https://github.com/kangindustries/Serpent">GitHub Repository →</a>
              </div>
            </article>

          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}