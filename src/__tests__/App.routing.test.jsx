import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { StoreProvider } from '../context/StoreProvider.jsx'
import { CoffeeProductPage } from '../pages/CoffeeProductPage.jsx'
import { renderAppWithDataRouter } from '../test-utils/renderAppWithDataRouter.jsx'
import { createFetchMock, SAMPLE_COFFEES } from '../test-utils/mockApiFetch.js'

describe('App routing', () => {
  const user = userEvent.setup()

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('loads the home hero from GET /store_info', async () => {
    const { router } = renderAppWithDataRouter(['/'])
    expect(router.state.location.pathname).toBe('/')
    expect(await screen.findByRole('heading', { name: /Coffee R Us/i })).toBeInTheDocument()
    expect(screen.getByText(/The go to store for your coffee needs/i)).toBeInTheDocument()
  })

  it('navigates between Home, Shop, and Admin via the navbar', async () => {
    const { router } = renderAppWithDataRouter(['/'])
    await screen.findByRole('heading', { name: /Coffee R Us/i })

    const nav = screen.getByRole('navigation', { name: 'Primary' })
    const inNav = within(nav)
    await user.click(inNav.getByRole('link', { name: 'Shop' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/shop'))
    expect(await screen.findByRole('link', { name: 'Vanilla Bean' })).toBeInTheDocument()

    await user.click(inNav.getByRole('link', { name: 'Admin Portal' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/admin'))
    expect(screen.getByText('Add a Coffee')).toBeInTheDocument()

    await user.click(inNav.getByRole('link', { name: 'Home' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/'))
  })

  it('opens a product detail route from the shop grid', async () => {
    const { router } = renderAppWithDataRouter(['/shop'])
    await screen.findByRole('link', { name: 'House Blend' })
    await user.click(screen.getByRole('link', { name: 'House Blend' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/coffee/2'))
    expect(
      await screen.findByRole('heading', { level: 1, name: 'House Blend' }),
    ).toBeInTheDocument()
  })
})

describe('CoffeeProductPage route (isolated)', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('PATCHes updates when the administrator saves changes', async () => {
    const user = userEvent.setup()
    const fetchMock = createFetchMock({ coffees: SAMPLE_COFFEES })
    vi.stubGlobal('fetch', fetchMock)

    const router = createMemoryRouter(
      [
        {
          path: '/coffee/:id',
          element: <CoffeeProductPage />,
        },
      ],
      { initialEntries: ['/coffee/1'] },
    )

    render(
      <StoreProvider>
        <RouterProvider router={router} />
      </StoreProvider>,
    )

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Vanilla Bean' }),
    ).toBeInTheDocument()

    const form = await screen.findByRole('form', { name: /edit coffee product/i })
    const priceInput = within(form).getByRole('textbox', { name: /^Price$/i })
    await user.clear(priceInput)
    await user.type(priceInput, '19.5')
    await user.click(screen.getByRole('button', { name: /Save changes/i }))

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(/updated successfully/i)
    })

    const patches = fetchMock.mock.calls.filter(
      ([url, init]) =>
        String(url).includes('/coffee/1') &&
        init &&
        String(init.method).toUpperCase() === 'PATCH',
    )
    expect(patches.length).toBeGreaterThanOrEqual(1)
    const lastPatch = JSON.parse(String(patches.at(-1)[1].body))
    expect(lastPatch.price).toBe(19.5)
  })
})
