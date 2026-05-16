import { ProductCard } from './ProductCard.jsx'

export function ProductList({ items }) {
  if (items.length === 0) {
    return (
      <div className="product-empty muted" role="status">
        No products match your search or filters.
      </div>
    )
  }

  return (
    <div className="product-grid">
      {items.map((coffee) => (
        <ProductCard key={coffee.id} coffee={coffee} />
      ))}
    </div>
  )
}
