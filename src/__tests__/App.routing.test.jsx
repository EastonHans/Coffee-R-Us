import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { StoreProvider } from '../context/StoreProvider.jsx'
import { SneakerProductPage } from '../pages/SneakerProductPage.jsx'
import { renderAppWithDataRouter } from '../test-utils/renderAppWithDataRouter.jsx'
import { createFetchMock, SAMPLE_SNEAKERS } from '../test-utils/mockApiFetch.js'

describe('App routing', () => {
  const user = userEvent.setup()

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('loads the home hero from GET /store_info', async () => {
    const { router } = renderAppWithDataRouter(['/'])
    expect(router.state.location.pathname).toBe('/')
    expect(await screen.findByRole('heading', { name: /STRYD/i })).toBeInTheDocument()
    expect(screen.getAllByText(/Born to Move/i).length).toBeGreaterThanOrEqual(1)
  })

  it('navigates between Home, Shop, and Admin via the navbar', async () => {
    const { router } = renderAppWithDataRouter(['/'])
    await screen.findByRole('heading', { name: /STRYD/i })

    const nav = screen.getByRole('navigation', { name: 'Primary' })
    const inNav = within(nav)
    await user.click(inNav.getByRole('link', { name: 'Shop' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/shop'))
    expect(await screen.findByRole('link', { name: 'Runner X1' })).toBeInTheDocument()

    await user.click(inNav.getByRole('link', { name: 'Admin' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/admin'))
    expect(screen.getByText(/ADD A/i)).toBeInTheDocument()

    await user.click(inNav.getByRole('link', { name: 'Home' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/'))
  })

  it('opens a product detail route from the shop grid', async () => {
    const { router } = renderAppWithDataRouter(['/shop'])
    await screen.findByRole('link', { name: 'Air Low' })
    await user.click(screen.getByRole('link', { name: 'Air Low' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/sneakers/2'))
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Air Low' }),
    ).toBeInTheDocument()
  })
})

describe('SneakerProductPage route (isolated)', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('PATCHes updates when the administrator saves changes', async () => {
    const user = userEvent.setup()
    const fetchMock = createFetchMock({ sneakers: SAMPLE_SNEAKERS })
    vi.stubGlobal('fetch', fetchMock)

    const router = createMemoryRouter(
      [{ path: '/sneakers/:id', element: <SneakerProductPage /> }],
      { initialEntries: ['/sneakers/1'] },
    )

    render(
      <StoreProvider>
        <RouterProvider router={router} />
      </StoreProvider>,
    )

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Runner X1' }),
    ).toBeInTheDocument()

    const form = await screen.findByRole('form', { name: /edit sneaker product/i })
    const priceInput = within(form).getByRole('textbox', { name: /^Price$/i })
    await user.clear(priceInput)
    await user.type(priceInput, '149')
    await user.click(screen.getByRole('button', { name: /Save changes/i }))

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(/updated successfully/i)
    })

    const patches = fetchMock.mock.calls.filter(
      ([url, init]) =>
        String(url).includes('/sneakers/1') &&
        init &&
        String(init.method).toUpperCase() === 'PATCH',
    )
    expect(patches.length).toBeGreaterThanOrEqual(1)
    expect(JSON.parse(String(patches.at(-1)[1].body)).price).toBe(149)
  })
})
