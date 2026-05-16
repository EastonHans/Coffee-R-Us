import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { vi } from 'vitest'
import { Layout } from '../components/Layout.jsx'
import { StoreProvider } from '../context/StoreProvider.jsx'
import { Home } from '../pages/Home.jsx'
import { Shop } from '../pages/Shop.jsx'
import { AdminPortal } from '../pages/AdminPortal.jsx'
import { CoffeeProductPage } from '../pages/CoffeeProductPage.jsx'
import { createFetchMock, SAMPLE_COFFEES } from './mockApiFetch.js'

const appRoutes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },
      { path: 'admin', element: <AdminPortal /> },
      { path: 'coffee/:id', element: <CoffeeProductPage /> },
    ],
  },
]

/**
 * Full app route tree with a data router (single document, no nested MemoryRouter).
 */
export function renderAppWithDataRouter(
  initialEntries = ['/'],
  { coffees = SAMPLE_COFFEES } = {},
) {
  const fetchMock = createFetchMock({ coffees })
  vi.stubGlobal('fetch', fetchMock)

  const router = createMemoryRouter(appRoutes, { initialEntries })

  const view = render(
    <StoreProvider>
      <RouterProvider router={router} />
    </StoreProvider>,
  )

  return { ...view, router, fetchMock }
}
