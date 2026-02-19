import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import kangLogo from '../assets/kang_industries.png'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // After navigating home with scrollTo state, scroll to #contact
  useEffect(() => {
    if (location.pathname === '/' && location.state?.scrollTo === 'contact') {
      const timer = setTimeout(() => {
        const el = document.getElementById('contact')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 120)
      return () => clearTimeout(timer)
    }
  }, [location])

  const handleContact = (e) => {
    e.preventDefault()
    if (location.pathname === '/') {
      const el = document.getElementById('contact')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/', { state: { scrollTo: 'contact' } })
    }
  }

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
          <a className="nav__link" href="#contact" onClick={handleContact}>
            <span>Contact</span>
          </a>
        </nav>
      </div>
    </header>
  )
}