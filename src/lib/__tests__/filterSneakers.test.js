import { describe, expect, it } from 'vitest'
import { filterSneakers } from '../filterSneakers.js'

const items = [
  { id: 1, name: 'Runner X1', description: 'carbon plate, fast', origin: 'Running', price: 129, tag: 'Best Seller' },
  { id: 2, name: 'Air Low', description: 'street ready, clean', origin: 'Lifestyle', price: 110 },
]

describe('filterSneakers', () => {
  it('returns all items when search empty, category all, and max price high', () => {
    expect(filterSneakers(items, '', 'all', 200)).toEqual(items)
  })

  it('filters by debounced search across name, description, category, and tag', () => {
    expect(filterSneakers(items, 'runner', 'all', 200)).toEqual([items[0]])
    expect(filterSneakers(items, 'best', 'all', 200)).toEqual([items[0]])
    expect(filterSneakers(items, 'street', 'all', 200)).toEqual([items[1]])
  })

  it('filters by active category', () => {
    expect(filterSneakers(items, '', 'Lifestyle', 200)).toEqual([items[1]])
    expect(filterSneakers(items, 'air', 'Running', 200)).toEqual([])
  })

  it('filters by max price', () => {
    expect(filterSneakers(items, '', 'all', 120)).toEqual([items[1]])
  })
})
