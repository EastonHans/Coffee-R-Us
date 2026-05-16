import { vi } from 'vitest'

const json = (body, ok = true, status = ok ? 200 : 400) =>
  Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(body),
  })

export const SAMPLE_COFFEES = [
  {
    id: 1,
    name: 'Vanilla Bean',
    description: 'Medium roast, nutty',
    origin: 'Columbia',
    price: 10,
  },
  {
    id: 2,
    name: 'House Blend',
    description: 'Dark roast, rich',
    origin: 'Vietnam',
    price: 12,
  },
]

/**
 * Simulates json-server style GET/POST/PATCH for `/store_info` and `/coffee`.
 * Keeps an in-memory list so reloads after mutations stay consistent.
 */
export function createFetchMock({
  storeInfo = [
    {
      id: 1,
      name: 'Coffee R Us',
      description: 'The go to store for your coffee needs',
      phone_number: '555-5555',
    },
  ],
  coffees: initialCoffees = SAMPLE_COFFEES,
} = {}) {
  let coffees = structuredClone(initialCoffees)

  return vi.fn(async (url, init = {}) => {
    const u = String(url)
    const method = String(init.method || 'GET').toUpperCase()

    if (method === 'GET' && u.includes('store_info')) {
      return json(storeInfo)
    }

    if (method === 'GET' && u.endsWith('/coffee')) {
      return json(coffees)
    }

    const patchMatch = u.match(/\/coffee\/([^/]+)/)
    if (method === 'PATCH' && patchMatch) {
      const id = Number(patchMatch[1])
      const partial = JSON.parse(String(init.body ?? '{}'))
      coffees = coffees.map((c) =>
        Number(c.id) === id ? { ...c, ...partial } : c,
      )
      const updated = coffees.find((c) => Number(c.id) === id)
      return updated ? json(updated) : json({ message: 'not found' }, false, 404)
    }

    const deleteMatch = u.match(/\/coffee\/([^/]+)/)
    if (method === 'DELETE' && deleteMatch) {
      const id = Number(deleteMatch[1])
      coffees = coffees.filter((c) => Number(c.id) !== id)
      return json({})
    }

    if (method === 'POST' && u.endsWith('/coffee')) {
      const body = JSON.parse(String(init.body ?? '{}'))
      const nextId = Math.max(0, ...coffees.map((c) => Number(c.id))) + 1
      const created = { id: nextId, ...body }
      coffees = [...coffees, created]
      return json(created)
    }

    return json({ message: 'not found' }, false, 404)
  })
}
