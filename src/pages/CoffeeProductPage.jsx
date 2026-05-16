import { useId, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../context/useStore.js'
import { parsePrice } from '../lib/parsePrice.js'

function AdminProductForm({ coffee, updateCoffee, onBanner }) {
  const formId = useId()
  const [name, setName] = useState(() => coffee.name ?? '')
  const [description, setDescription] = useState(() => coffee.description ?? '')
  const [origin, setOrigin] = useState(() => coffee.origin ?? '')
  const [price, setPrice] = useState(() => String(coffee.price ?? ''))
  const [saving, setSaving] = useState(false)

  const nameId = `${formId}-name`
  const descId = `${formId}-desc`
  const originId = `${formId}-origin`
  const priceId = `${formId}-price`

  const handleSave = async (e) => {
    e.preventDefault()
    const p = parsePrice(price)
    if (!Number.isFinite(p) || p <= 0) {
      onBanner('Please enter a valid price.')
      return
    }
    setSaving(true)
    onBanner('')
    try {
      await updateCoffee(coffee.id, {
        name: name.trim(),
        description: description.trim(),
        origin: origin.trim(),
        price: p,
      })
      onBanner('Product updated successfully.')
    } catch (err) {
      onBanner(err?.message ?? 'Update failed.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      className="admin-form admin-form--compact"
      aria-label="Edit coffee product"
      onSubmit={handleSave}
    >
      <div className="admin-form__fields">
        <div className="field">
          <label className="field__label" htmlFor={nameId}>
            Coffee Name
          </label>
          <input
            id={nameId}
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field__label" htmlFor={descId}>
            Description
          </label>
          <textarea
            id={descId}
            className="input input--textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field__label" htmlFor={originId}>
            Origin
          </label>
          <input
            id={originId}
            className="input"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field__label" htmlFor={priceId}>
            Price
          </label>
          <input
            id={priceId}
            className="input"
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </div>
      <div className="admin-form__actions admin-form__actions--split">
        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}

export function CoffeeProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { coffees, loading, error, updateCoffee, deleteCoffee } = useStore()
  const statusRef = useRef(null)

  const coffee = coffees.find((c) => String(c.id) === String(id))
  const [banner, setBanner] = useState('')

  const focusStatus = () => {
    statusRef.current?.focus()
  }

  const handleBanner = (msg) => {
    setBanner(msg)
    if (msg) queueMicrotask(focusStatus)
  }

  if (loading && !coffee) {
    return (
      <div className="product-page" aria-busy="true">
        <p className="muted" style={{ textAlign: 'center', paddingTop: '6rem' }}>Loading product…</p>
      </div>
    )
  }

  if (error && !coffee) {
    return (
      <div className="product-page">
        <div className="product-page__inner">
          <p className="error-text" role="alert">{error}</p>
          <Link to="/shop" className="text-link">Back to shop</Link>
        </div>
      </div>
    )
  }

  if (!coffee) {
    return (
      <div className="product-page">
        <div className="product-page__inner">
          <p className="muted">We could not find that product.</p>
          <Link to="/shop" className="text-link">Back to shop</Link>
        </div>
      </div>
    )
  }

  const formKey = `${coffee.id}-${coffee.price}-${coffee.name}`

  return (
    <div className="product-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/shop" className="text-link">Shop</Link>
        <span aria-hidden="true"> / </span>
        <span>{coffee.name}</span>
      </nav>

      <div className="product-detail">
        <header className="product-detail__header">
          <h1 className="product-detail__title">{coffee.name}</h1>
          <p className="product-detail__lede">{coffee.description}</p>
          <p className="product-detail__meta">
            <strong>Origin:</strong> {coffee.origin}
          </p>
          <p className="product-detail__meta">
            <strong>Price:</strong> ${Number(coffee.price).toFixed(2)}
          </p>
        </header>

        <section className="admin-edit" aria-labelledby="edit-heading">
          <h2 id="edit-heading" className="admin-edit__title">
            Administrator edits
          </h2>
          <p className="muted small">
            Update catalog fields; changes are saved to the simulated API (
            <code className="inline-code">PATCH /coffee/:id</code>).
          </p>

          <div
            ref={statusRef}
            tabIndex={-1}
            className={`status-banner${banner.includes('success') ? ' status-banner--ok' : ''}`}
            role="status"
          >
            {banner}
          </div>

          <AdminProductForm
            key={formKey}
            coffee={coffee}
            updateCoffee={updateCoffee}
            onBanner={handleBanner}
          />
          <div className="product-page__back">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => navigate('/shop')}
            >
              Back to shop
            </button>
            <button
              type="button"
              className="btn btn--danger"
              onClick={async () => {
                if (!window.confirm(`Delete "${coffee.name}"?`)) return
                try {
                  await deleteCoffee(coffee.id)
                  navigate('/shop')
                } catch (err) {
                  handleBanner(err?.message ?? 'Delete failed.')
                }
              }}
            >
              Delete product
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
