import { NavLink } from 'react-router-dom'

const linkClass = ({ isActive }) =>
  `nav__link${isActive ? ' nav__link--active' : ''}`

export function Navbar() {
  return (
    <header className="nav">
      <nav className="nav__inner" aria-label="Primary">
        <NavLink to="/" className="nav__logo" end>
          STRYD
        </NavLink>
        <div className="nav__links">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/shop" className={linkClass}>
            Shop
          </NavLink>
          <NavLink to="/admin" className={linkClass}>
            Admin
          </NavLink>
        </div>
      </nav>
    </header>
  )
}
