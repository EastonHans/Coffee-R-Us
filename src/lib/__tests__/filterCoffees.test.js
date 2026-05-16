import { describe, expect, it } from 'vitest'
import { filterCoffees } from '../filterCoffees.js'

const items = [
  { id: 1, name: 'Alpha', description: 'smooth', origin: 'Kenya', price: 1 },
  { id: 2, name: 'Beta Bean', description: 'bold', origin: 'Vietnam', price: 2 },
]

describe('filterCoffees', () => {
  it('returns all items when search empty and no origin filter', () => {
    expect(filterCoffees(items, '', new Set())).toEqual(items)
  })

  it('filters by debounced search across name, description, and origin', () => {
    expect(filterCoffees(items, 'beta', new Set())).toEqual([items[1]])
    expect(filterCoffees(items, 'kenya', new Set())).toEqual([items[0]])
    expect(filterCoffees(items, 'bold', new Set())).toEqual([items[1]])
  })

  it('applies origin set when non-empty', () => {
    const origins = new Set(['Vietnam'])
    expect(filterCoffees(items, '', origins)).toEqual([items[1]])
    expect(filterCoffees(items, 'bean', origins)).toEqual([items[1]])
  })

  it('combines search and origin filters', () => {
    const origins = new Set(['Kenya'])
    expect(filterCoffees(items, 'beta', origins)).toEqual([])
    expect(filterCoffees(items, 'alpha', origins)).toEqual([items[0]])
  })
})
