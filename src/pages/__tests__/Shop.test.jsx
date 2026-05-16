import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { StoreProvider } from '../../context/StoreProvider.jsx'
import { Shop } from '../Shop.jsx'
import { createFetchMock, SAMPLE_COFFEES } from '../../test-utils/mockApiFetch.js'

function renderShop() {
  vi.stubGlobal('fetch', createFetchMock({ coffees: SAMPLE_COFFEES }))
  return render(
    <MemoryRouter>
      <StoreProvider>
        <Shop />
      </StoreProvider>
    </MemoryRouter>,
  )
}

describe('Shop', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('lists products after catalog loads', async () => {
    renderShop()
    expect(await screen.findByRole('link', { name: 'Vanilla Bean' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'House Blend' })).toBeInTheDocument()
  })

  it('debounced search narrows visible products', async () => {
    const user = userEvent.setup()
    renderShop()
    await screen.findByRole('link', { name: 'House Blend' })

    const search = within(screen.getByTestId('shop-sidebar')).getByPlaceholderText(
      'Search',
    )
    await user.type(search, 'House')

    await waitFor(
      () => {
        expect(screen.getByRole('link', { name: 'House Blend' })).toBeInTheDocument()
        expect(screen.queryByRole('link', { name: 'Vanilla Bean' })).not.toBeInTheDocument()
      },
      { timeout: 4000 },
    )
  })

  it('origin checkbox filters the grid', async () => {
    const user = userEvent.setup()
    renderShop()
    await screen.findByRole('link', { name: 'Vanilla Bean' })

    const sidebar = screen.getByTestId('shop-sidebar')
    await user.click(within(sidebar).getByRole('checkbox', { name: /Columbia/i }))

    expect(screen.getByRole('link', { name: 'Vanilla Bean' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'House Blend' })).not.toBeInTheDocument()
  })
})
