import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/Layout.jsx'
import { useCounterAnimation } from '../hooks/useDebouncedValue.js'
import { useStore } from '../context/useStore.js'
import { HERO_IMAGE, STORY_IMAGE } from '../lib/filterSneakers.js'

const MARQUEE_ITEMS = [
  'Born to Move',
  'Free Shipping Over $100',
  'New Drop Every Friday',
  'Engineered For Speed',
]

function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div className="marquee-wrap" aria-hidden="true">
      <div className="marquee-track">
        {items.map((text, i) => (
          <span key={`${text}-${i}`} className="marquee-item">
            {text} <span>·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function StatItem({ target, label, delay }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const value = useCounterAnimation(target, visible)

  return (
    <div ref={ref} className={`stat-item reveal${visible ? ' visible' : ''}`} style={delay != null ? { transitionDelay: `${delay}s` } : undefined}>
      <span className="stat-num">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

export function Home() {
  const { storeInfo, loading, error } = useStore()

  if (loading) {
    return (
      <section id="home" className="home-section home-section--loading" aria-busy="true">
        <p className="muted" style={{ padding: '8rem 3rem' }}>Loading…</p>
      </section>
    )
  }

  if (error) {
    return (
      <section id="home" className="home-section">
        <p className="error-text" role="alert" style={{ padding: '8rem 3rem' }}>
          {error}
        </p>
        <p className="muted small" style={{ padding: '0 3rem 3rem' }}>
          Start the API with <code className="inline-code">npm run server</code> or{' '}
          <code className="inline-code">npm run dev:full</code>.
        </p>
      </section>
    )
  }

  const phone = storeInfo?.phone_number

  return (
    <>
      <section id="home" className="home-section">
        <h2 className="sr-only">{storeInfo?.name ?? 'STRYD'}</h2>
        <div className="hero-bg-text" aria-hidden="true">
          STRYD
        </div>
        <div className="hero-main">
          <div className="hero-left">
            <Reveal className="hero-eyebrow">Born To Move</Reveal>
            <Reveal as="h1" className="hero-title" delay={0.1}>
              <span className="outline">PUSH</span>
              <br />
              <span className="filled">LIMIT</span>
              <br />
              <span className="outline">LESS</span>
            </Reveal>
            <Reveal as="p" className="hero-sub" delay={0.2}>
              Engineered for athletes. Designed for the street. Every STRYD silhouette starts with
              one question: <strong>what does it feel like to fly?</strong>
            </Reveal>
            <Reveal className="hero-btns" delay={0.3}>
              <Link to="/shop" className="btn-primary">
                Shop Collection
              </Link>
              <a href="#story" className="btn-ghost">
                Our Story
              </a>
            </Reveal>
          </div>
          <Reveal className="hero-right" delay={0.2}>
            <div className="hero-img-accent" aria-hidden="true" />
            <img
              className="hero-shoe-img"
              src={HERO_IMAGE}
              alt="STRYD flagship sneaker"
            />
            <div className="hero-img-label">STRYD Runner X1 — $129</div>
          </Reveal>
        </div>
        <div className="hero-stats">
          <StatItem target={200} label="+ Styles" />
          <StatItem target={54} label="Countries" delay={0.1} />
          <StatItem target={1200000} label="Pairs Sold" delay={0.2} />
          <StatItem target={11} label="Design Awards" delay={0.3} />
        </div>
      </section>

      <Marquee />

      <section id="story" className="story-section">
        <div className="story-bg-word" aria-hidden="true">
          MOVE
        </div>
        <div className="story-inner">
          <div className="story-left">
            <Reveal className="story-tag">Our Story</Reveal>
            <Reveal as="h2" className="story-headline" delay={0.1}>
              NOT JUST A<br />
              SHOE.
              <br />
              <em>A Statement.</em>
            </Reveal>
            <Reveal as="p" className="story-body" delay={0.2}>
              STRYD was born in a garage in 2018 with a single obsession:{' '}
              <strong>
                make the fastest shoe on the planet beautiful enough to wear anywhere.
              </strong>{' '}
              No compromises. No shortcuts.
            </Reveal>
            <Reveal as="p" className="story-body" delay={0.25}>
              Every foam compound is tested at altitude. Every upper is stress-mapped under load.
              We work with{' '}
              <strong>biomechanics labs, pro athletes, and industrial designers</strong> to ensure
              that when you lace up a STRYD, you feel something different — because it <em>is</em>{' '}
              different.
            </Reveal>
            <Reveal as="p" className="story-body" delay={0.3}>
              We don&apos;t follow trends. We set them. From the track to the pavement to the
              parties, <strong>STRYD belongs everywhere fast people go.</strong>
            </Reveal>
            {phone ? (
              <p className="story-body story-body--phone">
                Questions? Call <strong>{phone}</strong>
              </p>
            ) : null}
          </div>
          <Reveal className="story-right" delay={0.15}>
            <img className="story-img" src={STORY_IMAGE} alt="STRYD design process" />
            <Reveal as="blockquote" className="story-quote" delay={0.25}>
              &ldquo;The fastest shoe you&apos;ll ever refuse to take off.&rdquo;
            </Reveal>
          </Reveal>
        </div>
      </section>

      <section id="pillars" className="pillars-section">
        <div className="pillars-header">
          <Reveal className="story-tag">Why STRYD</Reveal>
          <Reveal as="h2" className="story-headline pillars-headline" delay={0.1}>
            THE DIFFERENCE
            <br />
            IS IN THE DETAIL
          </Reveal>
        </div>
        <div className="pillars-grid">
          <Reveal className="pillar">
            <div className="pillar-num">01</div>
            <div className="pillar-title">Carbon Propulsion</div>
            <p className="pillar-body">
              A full-length carbon fibre plate that stores and returns energy with every stride.
              Less effort. More speed. Measurably.
            </p>
          </Reveal>
          <Reveal className="pillar" delay={0.1}>
            <div className="pillar-num">02</div>
            <div className="pillar-title">StrydFoam™</div>
            <p className="pillar-body">
              Our proprietary nitrogen-infused foam delivers 40% more cushioning than conventional
              EVA at half the weight. Developed over 3 years with sports medicine labs.
            </p>
          </Reveal>
          <Reveal className="pillar" delay={0.2}>
            <div className="pillar-num">03</div>
            <div className="pillar-title">Built To Last</div>
            <p className="pillar-body">
              Every pair is stress-tested for 800+ miles. If it breaks within 2 years of normal use,
              we replace it. No receipts. No questions.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
