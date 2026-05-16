/**
 * Filters catalog items by optional debounced search text and selected origins.
 * When `selectedOrigins` is empty, no origin filter is applied.
 */
export function filterCoffees(coffees, debouncedSearch, selectedOrigins) {
  const q = debouncedSearch.trim().toLowerCase()
  return coffees.filter((c) => {
    if (selectedOrigins.size > 0 && !selectedOrigins.has(c.origin)) {
      return false
    }
    if (!q) return true
    const blob = `${c.name} ${c.description} ${c.origin}`.toLowerCase()
    return blob.includes(q)
  })
}
