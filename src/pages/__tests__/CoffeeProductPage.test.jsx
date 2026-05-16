import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { StoreProvider } from '../../context/StoreProvider.jsx'
import { CoffeeProductPage } from '../CoffeeProductPage.jsx'
import { createFetchMock, SAMPLE_COFFEES } from '../../test-utils/mockApiFetch.js'

function renderProductPage(id = '1') {
  const fetchMock = createFetchMock({ coffees: SAMPLE_COFFEES })
  vi.stubGlobal('fetch', fetchMock)

  const router = createMemoryRouter(
    [{ path: '/coffee/:id', element: <CoffeeProductPage /> }],
    { initialEntries: [`/coffee/${id}`] },
  )

  render(
    <StoreProvider>
      <RouterProvider router={router} />
    </StoreProvider>,
  )

  return { router, fetchMock }
}

describe('CoffeeProductPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('displays product details for the given id', async () => {
    renderProductPage('1')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Vanilla Bean' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Origin:/i)).toBeInTheDocument()
  })

  it('PATCHes the product when save changes is submitted', async () => {
    const user = userEvent.setup()
    const { fetchMock } = renderProductPage('1')

    const form = await screen.findByRole('form', { name: /edit coffee product/i })
    const priceInput = within(form).getByRole('textbox', { name: /^Price$/i })
    await user.clear(priceInput)
    await user.type(priceInput, '22')
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
    expect(JSON.parse(String(patches.at(-1)[1].body)).price).toBe(22)
  })

  it('DELETEs the product and navigates to /shop', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('confirm', () => true)
    const { router, fetchMock } = renderProductPage('1')

    await screen.findByRole('heading', { level: 1, name: 'Vanilla Bean' })
    await user.click(screen.getByRole('button', { name: /Delete product/i }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/shop')
    })

    const deletes = fetchMock.mock.calls.filter(
      ([url, init]) =>
        String(url).includes('/coffee/1') &&
        init &&
        String(init.method).toUpperCase() === 'DELETE',
    )
    expect(deletes.length).toBeGreaterThanOrEqual(1)
  })
})
