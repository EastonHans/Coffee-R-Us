import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { vi } from 'vitest'
import { Layout } from '../components/Layout.jsx'
import { StoreProvider } from '../context/StoreProvider.jsx'
import { Home } from '../pages/Home.jsx'
import { Shop } from '../pages/Shop.jsx'
import { AdminPortal } from '../pages/AdminPortal.jsx'
import { SneakerProductPage } from '../pages/SneakerProductPage.jsx'
import { createFetchMock, SAMPLE_SNEAKERS } from './mockApiFetch.js'

const appRoutes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },
      { path: 'admin', element: <AdminPortal /> },
      { path: 'sneakers/:id', element: <SneakerProductPage /> },
    ],
  },
]

export function renderAppWithDataRouter(
  initialEntries = ['/'],
  { sneakers = SAMPLE_SNEAKERS } = {},
) {
  const fetchMock = createFetchMock({ sneakers })
  vi.stubGlobal('fetch', fetchMock)

  const router = createMemoryRouter(appRoutes, { initialEntries })

  const view = render(
    <StoreProvider>
      <RouterProvider router={router} />
    </StoreProvider>,
  )

  return { ...view, router, fetchMock }
}
