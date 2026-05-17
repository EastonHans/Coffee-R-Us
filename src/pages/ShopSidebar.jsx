import { useId } from 'react'
import { Reveal } from '../components/Layout.jsx'
import { PRICE_MAX, PRICE_MIN } from '../lib/filterSneakers.js'

const CATEGORY_FILTERS = [
  { label: 'All Styles', value: 'all' },
  { label: 'Running', value: 'Running' },
  { label: 'Lifestyle', value: 'Lifestyle' },
  { label: 'Court', value: 'Court' },
  { label: 'Trail', value: 'Trail' },
]

export function ShopSidebar({
  searchQuery,
  onSearchQueryChange,
  activeCategory,
  onCategoryChange,
  maxPrice,
  onMaxPriceChange,
}) {
  const baseId = useId()
  const searchId = `${baseId}-search`
  const rangeId = `${baseId}-price`

  return (
    <Reveal as="aside" className="sidebar" data-testid="shop-sidebar" aria-label="Search and filters">
      <div className="sb-section">
        <p className="sb-label">Search</p>
        <div className="search-wrap">
          <svg
            className="search-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <label className="sr-only" htmlFor={searchId}>
            Search products
          </label>
          <input
            id={searchId}
            type="search"
            placeholder="Search styles…"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            autoComplete="off"
          />
        </div>
      </div>

      <div className="sb-section">
        <p className="sb-label">Category</p>
        {CATEGORY_FILTERS.map(({ label, value }) => (
          <button
            key={value}
            type="button"
            className={`filter-chip${activeCategory === value ? ' active' : ''}`}
            data-cat={value}
            onClick={() => onCategoryChange(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="sb-section">
        <p className="sb-label">Max Price</p>
        <div className="price-row">
          <span className="price-row__min">$0</span>
          <span className="price-val">${maxPrice}</span>
        </div>
        <input
          id={rangeId}
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={5}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
        />
      </div>
    </Reveal>
  )
}
