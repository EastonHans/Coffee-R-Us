import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderAppWithDataRouter } from '../../test-utils/renderAppWithDataRouter.jsx'

describe('Home', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders store name and tagline from GET /store_info', async () => {
    renderAppWithDataRouter(['/'])
    expect(await screen.findByRole('heading', { name: /STRYD/i })).toBeInTheDocument()
    expect(screen.getAllByText(/Born to Move/i).length).toBeGreaterThanOrEqual(1)
  })

  it('renders phone number when present', async () => {
    renderAppWithDataRouter(['/'])
    expect(await screen.findByText(/555-5555/)).toBeInTheDocument()
  })
})
