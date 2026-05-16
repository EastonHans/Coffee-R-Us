import { useId } from 'react'

const LOCATION_FILTERS = [
  { label: 'Columbia',  origin: 'Columbia' },
  { label: 'Vietnam',   origin: 'Vietnam' },
  { label: 'Ethiopia',  origin: 'Ethiopia' },
  { label: 'Kenya',     origin: 'Kenya' },
]

export function ShopSidebar({
  searchQuery,
  onSearchQueryChange,
  selectedOrigins,
  onToggleOrigin,
}) {
  const baseId = useId()
  const searchId = `${baseId}-search`

  return (
    <aside
      className="shop-sidebar"
      data-testid="shop-sidebar"
      aria-label="Search and filters"
    >
      <div className="sidebar-search">
        <svg
          className="sidebar-search__icon"
          xmlns="http://www.w3.org/2000/svg"
          width="14" height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <label className="sr-only" htmlFor={searchId}>Search products</label>
        <input
          id={searchId}
          className="input--search"
          type="search"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          autoComplete="off"
        />
      </div>

      <fieldset className="filter-fieldset">
        <legend className="filter-fieldset__legend">Origin</legend>
        <ul className="filter-list">
          {LOCATION_FILTERS.map(({ label, origin }) => {
            const inputId = `${baseId}-origin-${origin}`
            return (
              <li key={origin}>
                <label className="checkbox-row" htmlFor={inputId}>
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={selectedOrigins.has(origin)}
                    onChange={() => onToggleOrigin(origin)}
                  />
                  <span>{label}</span>
                </label>
              </li>
            )
          })}
        </ul>
      </fieldset>
    </aside>
  )
}
