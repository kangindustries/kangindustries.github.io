import { useEffect, useRef } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import ScrollProgress from '../components/ScrollProgress.jsx'
import { useScrollObserver } from '../hooks/useScrollObserver.js'
import passwordBioticsImg from '../assets/elementor-placeholder-image.png'
import identifileImg from '../assets/elementor-placeholder-image.png'
import serpentImg from '../assets/serpent.png'

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
    title.querySelectorAll('.char').forEach((s, i) => { s.style.animationDelay = `${0.05 + i * 0.045}s` })
  }, [])
  return <h1 className="title title--sm" ref={titleRef}>{children}</h1>
}

const PROJECTS = [
  {
    id: 'PasswordBiotics',
    number: '001',
    name: 'PasswordBiotics',
    status: 'COMPLETED',
    tags: ['Python', 'HTML'],
    description: 'PasswordBiotics is a flask-based password evaluation tool using the zxcvbn library. It incorporates blacklist detection using a list of 1000 commonly used passwords and leetspeak normalization to enhance the robustness of the tool.',
    link: 'https://github.com/kangindustries/PasswordBiotics',
    linkLabel: 'GitHub Repository',
    accent: 'rgba(96,165,250,0.06)',
    accentBorder: 'rgba(96,165,250,0.25)',
    accentText: '#60a5fa',
    image: passwordBioticsImg,
  },
  {
    id: 'Identifile',
    number: '002',
    name: 'Identifile',
    status: 'COMPLETED',
    tags: ['Python', 'HTML'],
    description: 'Identifile is a file-type identification tool that uses a file\'s "magic number", also known as a signature, to identify its real format regardless of the file extension or name.',
    link: 'https://github.com/kangindustries/Identifile',
    linkLabel: 'GitHub Repository',
    accent: 'rgba(167,139,250,0.06)',
    accentBorder: 'rgba(167,139,250,0.25)',
    accentText: '#a78bfa',
    image: identifileImg,
  },
  {
    id: 'Serpent',
    number: '003',
    name: 'Serpent',
    status: 'ACTIVE',
    tags: ['Python', 'YARA'],
    description: 'Serpent is a malware scanner that uses YARA rules originally developed by VirusTotal to detect the presence of malicious software. YARA rules are considered gold standard in detecting patterns commonly found in malicious software.',
    link: 'https://github.com/kangindustries/Serpent',
    linkLabel: 'GitHub Repository',
    accent: 'rgba(248,113,113,0.06)',
    accentBorder: 'rgba(248,113,113,0.25)',
    accentText: '#f87171',
    image: serpentImg,
  },
]

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

          <div className="proj-list">
            {PROJECTS.map((p, i) => (
              <article
                key={p.id}
                className={`proj-row card${i % 2 === 1 ? ' proj-row--flip' : ''}`}
                style={{ '--accent': p.accent, '--accent-border': p.accentBorder, '--accent-text': p.accentText }}
              >
                <div className="card-border"></div>

                {/* LEFT: info */}
                <div className="proj-row__info">
                  <div className="proj-row__number-bg">{p.number}</div>
                  <div className="proj-row__meta">
                    <span
                      className="proj-row__status"
                      style={{
                        color: p.status === 'ACTIVE' ? '#34d399' : p.accentText,
                        borderColor: p.status === 'ACTIVE' ? 'rgba(52,211,153,0.3)' : p.accentBorder
                      }}
                    >
                      {p.status === 'ACTIVE' ? '● ' : '○ '}{p.status}
                    </span>
                  </div>

                  <h2 className="proj-row__name">{p.name}</h2>

                  <div className="tags" style={{ marginTop: '16px' }}>
                    {p.tags.map(t => <span className="tag" key={t}>{t}</span>)}
                  </div>

                  <p className="proj-row__desc">{p.description}</p>

                  <a className="proj-row__link" href={p.link} target="_blank" rel="noopener noreferrer">
                    {p.linkLabel} →
                  </a>
                </div>

                {/* RIGHT: image */}
                <div className="proj-row__visual">
                  <div className="proj-row__code-wrap">
                    <div className="proj-row__code-bar">
                      <span className="term-dot term-dot--red" />
                      <span className="term-dot term-dot--yellow" />
                      <span className="term-dot term-dot--green" />
                      <span className="proj-row__code-filename">{p.name.toLowerCase()}</span>
                    </div>
                    <img
                      src={p.image}
                      alt={p.name}
                      className="proj-row__img"
                    />
                  </div>
                </div>

              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}