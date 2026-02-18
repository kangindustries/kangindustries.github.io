import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import kangLogo from '../assets/kang_industries.png'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`topbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container topbar__inner">
        <NavLink className="brand" to="/" aria-label="Home">
          <img src={kangLogo} alt="Kang Industries" className="brand__img" />
        </NavLink>
        <nav className="nav" aria-label="Primary">
          <NavLink
            className={({ isActive }) => `nav__link${isActive ? ' active' : ''}`}
            to="/projects"
          >
            <span>Projects</span>
          </NavLink>
          <NavLink
            className={({ isActive }) => `nav__link${isActive ? ' active' : ''}`}
            to="/blog"
          >
            <span>Blog</span>
          </NavLink>
        </nav>
      </div>
    </header>
  )
}