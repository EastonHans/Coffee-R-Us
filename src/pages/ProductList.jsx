import { ProductCard } from './ProductCard.jsx'

export function ProductList({ items }) {
  if (items.length === 0) {
    return (
      <div className="product-empty" role="status">
        No styles found
      </div>
    )
  }

  return (
    <div className="product-grid">
      {items.map((item) => (
        <ProductCard key={item.id} sneaker={item} />
      ))}
    </div>
  )
}
