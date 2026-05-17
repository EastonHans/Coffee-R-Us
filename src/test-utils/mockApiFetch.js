import { vi } from 'vitest'

const json = (body, ok = true, status = ok ? 200 : 400) =>
  Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(body),
  })

export const SAMPLE_SNEAKERS = [
  { id: 1, name: 'Runner X1', description: 'Carbon plate, race-day performance', origin: 'Running', price: 129 },
  { id: 2, name: 'Air Low', description: 'Street-ready silhouette, all-day comfort', origin: 'Lifestyle', price: 110 },
]

export function createFetchMock({
  storeInfo = [
    { id: 1, name: 'STRYD', description: 'Born to Move', phone_number: '555-5555' },
  ],
  sneakers: initialSneakers = SAMPLE_SNEAKERS,
} = {}) {
  let sneakers = structuredClone(initialSneakers)

  return vi.fn(async (url, init = {}) => {
    const u = String(url)
    const method = String(init.method || 'GET').toUpperCase()

    if (method === 'GET' && u.includes('store_info')) return json(storeInfo)
    if (method === 'GET' && u.endsWith('/sneakers')) return json(sneakers)

    const patchMatch = u.match(/\/sneakers\/([^/]+)/)
    if (method === 'PATCH' && patchMatch) {
      const id = Number(patchMatch[1])
      const partial = JSON.parse(String(init.body ?? '{}'))
      sneakers = sneakers.map((c) => Number(c.id) === id ? { ...c, ...partial } : c)
      const updated = sneakers.find((c) => Number(c.id) === id)
      return updated ? json(updated) : json({ message: 'not found' }, false, 404)
    }

    const deleteMatch = u.match(/\/sneakers\/([^/]+)/)
    if (method === 'DELETE' && deleteMatch) {
      const id = Number(deleteMatch[1])
      sneakers = sneakers.filter((c) => Number(c.id) !== id)
      return json({})
    }

    if (method === 'POST' && u.endsWith('/sneakers')) {
      const body = JSON.parse(String(init.body ?? '{}'))
      const nextId = Math.max(0, ...sneakers.map((c) => Number(c.id))) + 1
      const created = { id: nextId, ...body }
      sneakers = [...sneakers, created]
      return json(created)
    }

    return json({ message: 'not found' }, false, 404)
  })
}
