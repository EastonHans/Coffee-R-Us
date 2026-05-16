import { useCallback, useMemo, useState } from 'react'
import { useDebouncedValue } from '../hooks/useDebouncedValue.js'
import { useStore } from '../context/useStore.js'
import { filterCoffees } from '../lib/filterCoffees.js'
import { ShopSidebar } from './ShopSidebar.jsx'
import { ProductList } from './ProductList.jsx'

export function Shop() {
  const { coffees, loading, error } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebouncedValue(searchQuery, 280)
  const [selectedOrigins, setSelectedOrigins] = useState(() => new Set())

  const toggleOrigin = useCallback((origin) => {
    setSelectedOrigins((prev) => {
      const next = new Set(prev)
      if (next.has(origin)) next.delete(origin)
      else next.add(origin)
      return next
    })
  }, [])

  const filtered = useMemo(
    () => filterCoffees(coffees, debouncedSearch, selectedOrigins),
    [coffees, debouncedSearch, selectedOrigins],
  )

  if (loading) {
    return (
      <div className="shop-page" aria-busy="true">
        <p className="muted" style={{ textAlign: 'center', paddingTop: '8rem' }}>Loading catalog…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="shop-page">
        <p className="error-text" role="alert" style={{ textAlign: 'center', paddingTop: '8rem' }}>
          {error}
        </p>
      </div>
    )
  }

  return (
    <div className="shop-page">
      <div className="shop-header">
        <p className="section-label">Our Selection</p>
        <h2 className="section-title">The Collection</h2>
      </div>
      <div className="shop-layout">
        <ShopSidebar
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          selectedOrigins={selectedOrigins}
          onToggleOrigin={toggleOrigin}
        />
        <section className="shop-content" aria-label="Product catalog">
          <ProductList items={filtered} />
        </section>
      </div>
    </div>
  )
}
