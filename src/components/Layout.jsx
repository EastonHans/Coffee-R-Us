import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar.jsx'

export function Layout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
