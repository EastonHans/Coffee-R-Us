import { useEffect, useRef, useState } from 'react'

/**
 * Returns a debounced copy of `value` for dynamic search/filter UX.
 */
export function useDebouncedValue(value, delayMs = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(id)
  }, [value, delayMs])

  return debounced
}

export function useReveal(ref, threshold = 0.1) {
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('visible')
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, threshold])
}

function formatCount(n, target) {
  return target >= 100_000 ? Math.round(n).toLocaleString() : String(Math.round(n))
}

export function useCounterAnimation(target, enabled) {
  const [value, setValue] = useState('0')
  const ran = useRef(false)

  useEffect(() => {
    if (!enabled || ran.current) return undefined
    ran.current = true
    const duration = 1800
    const start = performance.now()
    let frame
    const step = (ts) => {
      const p = Math.min((ts - start) / duration, 1)
      const ease = 1 - (1 - p) ** 3
      setValue(formatCount(ease * target, target))
      if (p < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target, enabled])

  return value
}
