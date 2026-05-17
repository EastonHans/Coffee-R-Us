import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { StoreProvider } from '../../context/StoreProvider.jsx'
import { Shop } from '../Shop.jsx'
import { createFetchMock, SAMPLE_SNEAKERS } from '../../test-utils/mockApiFetch.js'

function renderShop() {
  vi.stubGlobal('fetch', createFetchMock({ sneakers: SAMPLE_SNEAKERS }))
  return render(
    <MemoryRouter>
      <StoreProvider>
        <Shop />
      </StoreProvider>
    </MemoryRouter>,
  )
}

describe('Shop', () => {
  beforeEach(() => { vi.unstubAllGlobals() })
  afterEach(() => { vi.unstubAllGlobals() })

  it('lists products after catalog loads', async () => {
    renderShop()
    expect(await screen.findByRole('link', { name: 'Runner X1' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Air Low' })).toBeInTheDocument()
  })

  it('debounced search narrows visible products', async () => {
    const user = userEvent.setup()
    renderShop()
    await screen.findByRole('link', { name: 'Air Low' })

    const search = within(screen.getByTestId('shop-sidebar')).getByPlaceholderText('Search styles…')
    await user.type(search, 'Air')

    await waitFor(
      () => {
        expect(screen.getByRole('link', { name: 'Air Low' })).toBeInTheDocument()
        expect(screen.queryByRole('link', { name: 'Runner X1' })).not.toBeInTheDocument()
      },
      { timeout: 4000 },
    )
  })

  it('category chip filters the grid', async () => {
    const user = userEvent.setup()
    renderShop()
    await screen.findByRole('link', { name: 'Runner X1' })

    const sidebar = screen.getByTestId('shop-sidebar')
    await user.click(within(sidebar).getByRole('button', { name: /Running/i }))

    expect(screen.getByRole('link', { name: 'Runner X1' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Air Low' })).not.toBeInTheDocument()
  })
})
