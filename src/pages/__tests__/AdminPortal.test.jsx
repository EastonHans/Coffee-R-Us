import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderAppWithDataRouter } from '../../test-utils/renderAppWithDataRouter.jsx'

describe('AdminPortal', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows validation when category is missing', async () => {
    const user = userEvent.setup()
    renderAppWithDataRouter(['/admin'])
    const form = await screen.findByRole('form', { name: /add new sneaker product/i })

    await user.type(within(form).getByRole('textbox', { name: /shoe name/i }), 'Test Style')
    await user.type(within(form).getByRole('textbox', { name: /description/i }), 'Great shoe')
    await user.click(within(form).getByRole('button', { name: /add to collection/i }))

    expect(await screen.findByText(/Pick a category/i)).toBeInTheDocument()
    const posts = globalThis.fetch.mock.calls.filter(
      ([, init]) => init && String(init.method).toUpperCase() === 'POST',
    )
    expect(posts).toHaveLength(0)
  })

  it('submits a new style and navigates to the shop', async () => {
    const user = userEvent.setup()
    const { router, fetchMock } = renderAppWithDataRouter(['/admin'])
    const form = await screen.findByRole('form', { name: /add new sneaker product/i })

    await user.type(within(form).getByRole('textbox', { name: /shoe name/i }), 'Phantom Elite')
    await user.selectOptions(within(form).getByRole('combobox', { name: /category/i }), 'Trail')
    await user.type(within(form).getByRole('textbox', { name: /description/i }), 'Max grip trail runner')
    await user.click(within(form).getByRole('button', { name: /add to collection/i }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/shop')
    })

    const posts = fetchMock.mock.calls.filter(
      ([url, init]) =>
        String(url).endsWith('/sneakers') &&
        init &&
        String(init.method).toUpperCase() === 'POST',
    )
    expect(posts.length).toBeGreaterThanOrEqual(1)
    const body = JSON.parse(String(posts.at(-1)[1].body))
    expect(body).toMatchObject({ name: 'Phantom Elite', origin: 'Trail' })
  })
})
