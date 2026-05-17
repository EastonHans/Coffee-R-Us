import { useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Reveal } from '../components/Layout.jsx'
import { useStore } from '../context/useStore.js'
import { pickFallbackImage } from '../lib/filterSneakers.js'
import { parsePrice } from '../lib/parsePrice.js'

const CATEGORIES = ['Running', 'Lifestyle', 'Court', 'Trail']
const BADGE_TAGS = ['', 'New Drop', 'Best Seller', 'Limited']

export function AdminPortal() {
  const { addSneaker } = useStore()
  const navigate = useNavigate()
  const formId = useId()

  const [name, setName] = useState('')
  const [origin, setOrigin] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [tag, setTag] = useState('')
  const [img, setImg] = useState('')
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [added, setAdded] = useState(false)

  const validate = () => {
    const next = {}
    if (!name.trim()) next.name = 'Name is required.'
    if (!origin) next.cat = 'Pick a category.'
    if (!description.trim()) next.desc = 'Description is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    const p = parsePrice(price)
    const priceVal = Number.isFinite(p) && p > 0 ? p : 99

    setSaving(true)
    try {
      await addSneaker({
        name: name.trim(),
        description: description.trim(),
        origin,
        price: priceVal,
        tag: tag || undefined,
        img: img.trim() || pickFallbackImage(Date.now()),
      })
      setName('')
      setDescription('')
      setOrigin('')
      setPrice('')
      setTag('')
      setImg('')
      setErrors({})
      setAdded(true)
      navigate('/shop')
    } catch (err) {
      setErrors({ submit: err?.message ?? 'Could not save product.' })
    } finally {
      setSaving(false)
    }
  }

  const fg = (key, hasError) => `fg${hasError ? ' err' : ''}`

  return (
    <section id="admin" className="admin-page">
      <div className="admin-wrap">
        <Reveal className="admin-heading-block">
          <p className="admin-pre">Admin Portal</p>
          <h2 className="admin-h2">
            ADD A
            <br />
            STYLE
          </h2>
          <p className="admin-sub">New product will appear live in the shop immediately.</p>
        </Reveal>

        <Reveal className="admin-form" delay={0.1}>
          <form aria-label="Add new sneaker product" onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <div className={`${fg('name', errors.name)} form-full`}>
                <label htmlFor={`${formId}-name`}>Shoe Name</label>
                <input
                  id={`${formId}-name`}
                  type="text"
                  placeholder="e.g. STRYD Phantom Elite"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
                  }}
                />
                <span className="form-err">{errors.name}</span>
              </div>

              <div className={fg('cat', errors.cat)}>
                <label htmlFor={`${formId}-cat`}>Category</label>
                <select
                  id={`${formId}-cat`}
                  value={origin}
                  onChange={(e) => {
                    setOrigin(e.target.value)
                    if (errors.cat) setErrors((prev) => ({ ...prev, cat: undefined }))
                  }}
                >
                  <option value="">Select…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <span className="form-err">{errors.cat}</span>
              </div>

              <div className="fg">
                <label htmlFor={`${formId}-price`}>Price (USD)</label>
                <input
                  id={`${formId}-price`}
                  type="number"
                  min={0}
                  step={1}
                  placeholder="129"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className={`${fg('desc', errors.desc)} form-full`}>
                <label htmlFor={`${formId}-desc`}>Description</label>
                <textarea
                  id={`${formId}-desc`}
                  placeholder="Key tech, materials, vibes…"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value)
                    if (errors.desc) setErrors((prev) => ({ ...prev, desc: undefined }))
                  }}
                />
                <span className="form-err">{errors.desc}</span>
              </div>

              <div className="fg">
                <label htmlFor={`${formId}-tag`}>Badge Tag</label>
                <select id={`${formId}-tag`} value={tag} onChange={(e) => setTag(e.target.value)}>
                  <option value="">None</option>
                  {BADGE_TAGS.filter(Boolean).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="fg">
                <label htmlFor={`${formId}-img`}>Image URL (optional)</label>
                <input
                  id={`${formId}-img`}
                  type="text"
                  placeholder="https://…"
                  value={img}
                  onChange={(e) => setImg(e.target.value)}
                />
              </div>
            </div>

            {errors.submit ? (
              <p className="error-text" role="alert">
                {errors.submit}
              </p>
            ) : null}

            <button type="submit" className="submit-btn" disabled={saving}>
              {added ? 'Added ✓' : saving ? 'Adding…' : 'Add to Collection'}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
