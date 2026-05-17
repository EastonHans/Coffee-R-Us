import { useEffect, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import { useReveal } from '../hooks/useDebouncedValue.js'
import { Navbar } from './Navbar.jsx'

function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return undefined

    document.documentElement.classList.add('custom-cursor')
    let mx = 0
    let my = 0
    let rx = 0
    let ry = 0
    let frame

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      if (dotRef.current) {
        dotRef.current.style.left = `${mx}px`
        dotRef.current.style.top = `${my}px`
      }
    }

    const lerp = () => {
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      if (ringRef.current) {
        ringRef.current.style.left = `${rx}px`
        ringRef.current.style.top = `${ry}px`
      }
      frame = requestAnimationFrame(lerp)
    }

    window.addEventListener('mousemove', onMove)
    frame = requestAnimationFrame(lerp)

    return () => {
      document.documentElement.classList.remove('custom-cursor')
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} id="cursor-dot" className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} id="cursor-ring" className="cursor-ring" aria-hidden="true" />
    </>
  )
}

export function Reveal({ children, className = '', delay, as: Tag = 'div', ...rest }) {
  const ref = useRef(null)
  useReveal(ref)
  const style = delay != null ? { transitionDelay: `${delay}s`, ...rest.style } : rest.style
  const classes = ['reveal', className].filter(Boolean).join(' ')
  return (
    <Tag ref={ref} className={classes} {...rest} style={style}>
      {children}
    </Tag>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">STRYD</div>
      <div className="footer-center">© 2025 STRYD Inc. · Born to Move</div>
      <div className="footer-right">
        <a href="https://instagram.com">Instagram</a>
        <a href="https://tiktok.com">TikTok</a>
        <a href="https://x.com">X</a>
      </div>
    </footer>
  )
}

export function Layout() {
  return (
    <div className="app-shell">
      <CustomCursor />
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
