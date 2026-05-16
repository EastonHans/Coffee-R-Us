import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout.jsx'
import { Home } from './pages/Home.jsx'
import { Shop } from './pages/Shop.jsx'
import { AdminPortal } from './pages/AdminPortal.jsx'
import { CoffeeProductPage } from './pages/CoffeeProductPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="coffee/:id" element={<CoffeeProductPage />} />
        <Route path="admin" element={<AdminPortal />} />
      </Route>
    </Routes>
  )
}
