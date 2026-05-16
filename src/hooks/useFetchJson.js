import { useCallback, useEffect, useState } from 'react'

/**
 * Fetches JSON from a URL and exposes reload for mutations.
 * Used by the store provider for catalog data.
 */
export function useFetchJson(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      setData(await res.json())
    } catch (e) {
      setError(e?.message ?? 'Request failed')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    const ctrl = new AbortController()
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(url, { signal: ctrl.signal })
        if (!res.ok) throw new Error(`Request failed (${res.status})`)
        const json = await res.json()
        if (!cancelled) setData(json)
      } catch (e) {
        if (e?.name === 'AbortError') return
        if (!cancelled) {
          setError(e?.message ?? 'Request failed')
          setData(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    queueMicrotask(() => {
      void load()
    })

    return () => {
      cancelled = true
      ctrl.abort()
    }
  }, [url])

  return { data, loading, error, reload, setData }
}
