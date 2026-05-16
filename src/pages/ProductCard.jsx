import { Link } from 'react-router-dom'

export function ProductCard({ coffee }) {
  const { id, name, description, origin, price } = coffee
  return (
    <article className="product-card">
      <span className="product-card__badge">{origin}</span>
      <h2 className="product-card__title">
        <Link to={`/coffee/${id}`} className="product-card__link">
          {name}
        </Link>
      </h2>
      <p className="product-card__desc">{description}</p>
      <div className="product-card__footer">
        <span className="product-card__meta">{origin}</span>
        <span className="product-card__price">${Number(price).toFixed(2)}</span>
      </div>
    </article>
  )
}
