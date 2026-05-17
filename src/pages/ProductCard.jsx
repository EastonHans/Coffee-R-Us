import { Link } from 'react-router-dom'
import { pickFallbackImage } from '../lib/filterSneakers.js'

export function ProductCard({ sneaker }) {
  const { id, name, description, origin, price, tag, img } = sneaker
  const imageSrc = img || pickFallbackImage(Number(id))

  const handleImgError = (e) => {
    e.currentTarget.src = pickFallbackImage(Number(id))
  }

  return (
    <article className="product-card">
      <div className="card-img-wrap">
        <img src={imageSrc} alt={name} loading="lazy" onError={handleImgError} />
        {tag ? <span className="card-category">{tag}</span> : null}
        <Link to={`/sneakers/${id}`} className="card-quick">
          Quick View
        </Link>
      </div>
      <div className="card-info">
        <h2 className="card-name">
          <Link to={`/sneakers/${id}`} className="card-name__link">
            {name}
          </Link>
        </h2>
        <p className="card-desc">{description}</p>
        <div className="card-footer">
          <span className="card-price">${Number(price)}</span>
          <span className="card-tag">{origin}</span>
        </div>
      </div>
    </article>
  )
}
