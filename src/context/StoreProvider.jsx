import { useCallback, useMemo } from 'react'
import { StoreContext } from './storeContext.js'
import { useFetchJson } from '../hooks/useFetchJson.js'

export function StoreProvider({ children }) {
  const storeRes = useFetchJson('/store_info')
  const coffeeRes = useFetchJson('/coffee')

  const loading = storeRes.loading || coffeeRes.loading
  const error = storeRes.error || coffeeRes.error

  const storeInfo = useMemo(() => {
    const rows = storeRes.data
    if (!Array.isArray(rows) || rows.length === 0) return null
    return rows[0]
  }, [storeRes.data])

  const coffees = useMemo(() => {
    const rows = coffeeRes.data
    return Array.isArray(rows) ? rows : []
  }, [coffeeRes.data])

  const refreshAll = useCallback(async () => {
    await Promise.all([storeRes.reload(), coffeeRes.reload()])
  }, [storeRes, coffeeRes])

  const addCoffee = useCallback(
    async (payload) => {
      // Optimistic update — works even if the API is read-only (e.g. Vercel static)
      const nextId = Math.max(0, ...(coffeeRes.data ?? []).map((c) => Number(c.id))) + 1
      const created = { id: nextId, ...payload }
      coffeeRes.setData((prev) => [...(prev ?? []), created])

      // Best-effort persist to json-server when running locally
      fetch('/coffee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {/* no-op on static hosts */})
    },
    [coffeeRes],
  )

  const updateCoffee = useCallback(
    async (id, partial) => {
      coffeeRes.setData((prev) =>
        (prev ?? []).map((c) => (String(c.id) === String(id) ? { ...c, ...partial } : c)),
      )

      fetch(`/coffee/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partial),
      }).catch(() => {})
    },
    [coffeeRes],
  )

  const deleteCoffee = useCallback(
    async (id) => {
      coffeeRes.setData((prev) => (prev ?? []).filter((c) => String(c.id) !== String(id)))

      fetch(`/coffee/${id}`, { method: 'DELETE' }).catch(() => {})
    },
    [coffeeRes],
  )

  const value = useMemo(
    () => ({
      storeInfo,
      coffees,
      loading,
      error,
      refreshAll,
      addCoffee,
      updateCoffee,
      deleteCoffee,
    }),
    [storeInfo, coffees, loading, error, refreshAll, addCoffee, updateCoffee, deleteCoffee],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
