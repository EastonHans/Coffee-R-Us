import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderAppWithDataRouter } from '../../test-utils/renderAppWithDataRouter.jsx'

describe('AdminPortal', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows validation when origin is missing', async () => {
    const user = userEvent.setup()
    renderAppWithDataRouter(['/admin'])
    const form = await screen.findByRole('form', { name: /add new coffee product/i })

    await user.type(within(form).getByRole('textbox', { name: /^price$/i }), '9')
    await user.click(within(form).getByRole('button', { name: 'Submit' }))

    expect(
      await screen.findByText(/Origin is required/i),
    ).toBeInTheDocument()
    const posts = globalThis.fetch.mock.calls.filter(
      ([, init]) => init && String(init.method).toUpperCase() === 'POST',
    )
    expect(posts).toHaveLength(0)
  })

  it('submits a new product and navigates to the shop', async () => {
    const user = userEvent.setup()
    const { router, fetchMock } = renderAppWithDataRouter(['/admin'])
    const form = await screen.findByRole('form', { name: /add new coffee product/i })
    await within(form).findByRole('textbox', { name: /coffee name/i })

    await user.type(within(form).getByRole('textbox', { name: /coffee name/i }), 'Test Roast')
    await user.type(within(form).getByRole('textbox', { name: /description/i }), 'Chocolate notes')
    await user.type(within(form).getByRole('textbox', { name: /^origin$/i }), 'Ethiopia')
    await user.type(within(form).getByRole('textbox', { name: /^price$/i }), '18')
    await user.click(within(form).getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/shop')
    })

    const posts = fetchMock.mock.calls.filter(
      ([url, init]) =>
        String(url).includes('/coffee') &&
        String(url).match(/\/coffee\/?$/) &&
        init &&
        String(init.method).toUpperCase() === 'POST',
    )
    expect(posts.length).toBeGreaterThanOrEqual(1)
    const body = JSON.parse(String(posts.at(-1)[1].body))
    expect(body).toMatchObject({
      name: 'Test Roast',
      description: 'Chocolate notes',
      origin: 'Ethiopia',
      price: 18,
    })
  })
})
