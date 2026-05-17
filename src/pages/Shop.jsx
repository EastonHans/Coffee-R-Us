import { useMemo, useState } from 'react'
import { useDebouncedValue } from '../hooks/useDebouncedValue.js'
import { useStore } from '../context/useStore.js'
import { filterSneakers, PRICE_MAX } from '../lib/filterSneakers.js'
import { Reveal } from '../components/Layout.jsx'
import { ShopSidebar } from './ShopSidebar.jsx'
import { ProductList } from './ProductList.jsx'

export function Shop() {
  const { sneakers, loading, error } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebouncedValue(searchQuery, 280)
  const [activeCategory, setActiveCategory] = useState('all')
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX)

  const filtered = useMemo(
    () => filterSneakers(sneakers, debouncedSearch, activeCategory, maxPrice),
    [sneakers, debouncedSearch, activeCategory, maxPrice],
  )

  const countLabel = `${filtered.length} Product${filtered.length !== 1 ? 's' : ''}`

  if (loading) {
    return (
      <section id="shop" className="shop-page" aria-busy="true">
        <p className="muted" style={{ textAlign: 'center', paddingTop: '8rem' }}>Loading catalog…</p>
      </section>
    )
  }

  if (error) {
    return (
      <section id="shop" className="shop-page">
        <p className="error-text" role="alert" style={{ textAlign: 'center', paddingTop: '8rem' }}>
          {error}
        </p>
      </section>
    )
  }

  return (
    <section id="shop" className="shop-page">
      <Reveal className="shop-header">
        <div className="shop-title-group">
          <p className="section-tag">The Collection</p>
          <h2 className="shop-title">SHOP</h2>
        </div>
        <span className="product-count">{countLabel}</span>
      </Reveal>
      <div className="shop-layout">
        <ShopSidebar
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          maxPrice={maxPrice}
          onMaxPriceChange={setMaxPrice}
        />
        <section className="shop-content" aria-label="Product catalog">
          <ProductList items={filtered} />
        </section>
      </div>
    </section>
  )
}
