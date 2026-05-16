import { useStore } from '../context/useStore.js'

export function Home() {
  const { storeInfo, loading, error } = useStore()

  if (loading) {
    return (
      <section className="hero hero--center" aria-busy="true">
        <div className="hero-bg" />
        <p className="muted">Loading store…</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="hero hero--center">
        <div className="hero-bg" />
        <p className="error-text" role="alert">{error}</p>
        <p className="muted small">
          Start the API with <code className="inline-code">npm run server</code>{' '}
          or run <code className="inline-code">npm run dev:full</code>.
        </p>
      </section>
    )
  }

  const title = storeInfo?.name ?? 'Coffee R Us'
  const tagline = storeInfo?.description ?? 'The go to store for your coffee needs'

  return (
    <section className="hero hero--center" aria-labelledby="store-title">
      <div className="hero-bg" />
      <p className="hero__eyebrow">Est. Since the First Harvest</p>
      <h1 id="store-title" className="hero__title">
        {title}
      </h1>
      <div className="hero__rule" />
      <p className="hero__tagline">{tagline}</p>
      {storeInfo?.phone_number && (
        <p className="hero__phone">Call us: {storeInfo.phone_number}</p>
      )}
      <div className="hero__scroll" aria-hidden="true">
        <div className="hero__scroll-line" />
        <span></span>
      </div>
    </section>
  )
}
