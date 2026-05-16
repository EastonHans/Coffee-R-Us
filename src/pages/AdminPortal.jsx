import { useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/useStore.js'
import { parsePrice } from '../lib/parsePrice.js'

export function AdminPortal() {
  const { addCoffee } = useStore()
  const navigate = useNavigate()
  const formId = useId()
  const nameId = `${formId}-name`
  const descId = `${formId}-desc`
  const originId = `${formId}-origin`
  const priceId = `${formId}-price`
  const originRef = useRef(null)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [origin, setOrigin] = useState('')
  const [price, setPrice] = useState('')
  const [originError, setOriginError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [saving, setSaving] = useState(false)

  const validate = () => {
    let ok = true
    if (!origin.trim()) {
      setOriginError('Origin is required so customers know where beans are from.')
      ok = false
      originRef.current?.focus()
    } else {
      setOriginError('')
    }
    const p = parsePrice(price)
    if (!Number.isFinite(p) || p <= 0) {
      setSubmitError('Enter a valid price greater than zero.')
      ok = false
    } else {
      setSubmitError('')
    }
    return ok
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    if (!validate()) return
    const p = parsePrice(price)
    setSaving(true)
    try {
      await addCoffee({
        name: name.trim() || 'Untitled coffee',
        description: description.trim() || 'No description yet.',
        origin: origin.trim(),
        price: p,
      })
      setName('')
      setDescription('')
      setOrigin('')
      setPrice('')
      navigate('/shop')
    } catch (err) {
      setSubmitError(err?.message ?? 'Could not save product.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <p className="section-label">Admin Portal</p>
          <h2 className="section-title">Add a Coffee</h2>
        </div>
        <div className="admin-card">
          <form
            className="admin-form"
            aria-label="Add new coffee product"
            onSubmit={handleSubmit}
            noValidate
          >
          <div className="admin-form__fields">
            <div className="field">
              <label className="field__label" htmlFor={nameId}>
                Coffee Name
              </label>
              <input
                id={nameId}
                className="input"
                placeholder="Type here"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
              />
              <p className="assistive" id={`${nameId}-help`}>
                Shown on cards and the product page.
              </p>
            </div>

            <div className="field">
              <label className="field__label" htmlFor={descId}>
                Description
              </label>
              <input
                id={descId}
                className="input"
                placeholder="Describe flavor and roast"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                aria-describedby={`${descId}-help`}
              />
              <p className="assistive" id={`${descId}-help`}>
                A short sentence customers will read in the shop.
              </p>
            </div>

            <div className="field">
              <label className="field__label" htmlFor={originId}>
                Origin
              </label>
              <div className="input-wrap">
                <input
                  ref={originRef}
                  id={originId}
                  className={`input${originError ? ' input--error' : ''}`}
                  placeholder="e.g. Ethiopia"
                  value={origin}
                  onChange={(e) => {
                    setOrigin(e.target.value)
                    if (originError) setOriginError('')
                  }}
                  aria-invalid={Boolean(originError)}
                  aria-describedby={
                    originError ? `${originId}-err` : `${originId}-help`
                  }
                />
                {originError ? (
                  <span className="input-wrap__icon" aria-hidden="true">
                    !
                  </span>
                ) : null}
              </div>
              {originError ? (
                <p className="error-text" id={`${originId}-err`} role="alert">
                  {originError}
                </p>
              ) : (
                <p className="assistive" id={`${originId}-help`}>
                  Country or region; used for origin filters in the shop.
                </p>
              )}
            </div>

            <div className="field">
              <label className="field__label" htmlFor={priceId}>
                Price
              </label>
              <input
                id={priceId}
                className="input"
                inputMode="decimal"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          {submitError ? (
            <p className="error-text" role="alert">
              {submitError}
            </p>
          ) : null}

          <div className="admin-form__actions">
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? 'Submitting…' : 'Submit'}
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  )
}
