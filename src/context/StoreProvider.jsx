import { useCallback, useMemo } from 'react'
import { StoreContext } from './storeContext.js'
import { useFetchJson } from '../hooks/useFetchJson.js'

// CRUD actions: addSneaker (POST), updateSneaker (PATCH), deleteSneaker (DELETE)
// Mutations update local state optimistically so they work on static hosts too.
export function StoreProvider({ children }) {
  const storeRes = useFetchJson('/store_info')
  const sneakerRes = useFetchJson('/sneakers')

  const loading = storeRes.loading || sneakerRes.loading
  const error = storeRes.error || sneakerRes.error

  const storeInfo = useMemo(() => {
    const rows = storeRes.data
    if (!Array.isArray(rows) || rows.length === 0) return null
    return rows[0]
  }, [storeRes.data])

  const sneakers = useMemo(() => {
    const rows = sneakerRes.data
    return Array.isArray(rows) ? rows : []
  }, [sneakerRes.data])

  const refreshAll = useCallback(async () => {
    await Promise.all([storeRes.reload(), sneakerRes.reload()])
  }, [storeRes, sneakerRes])

  const addSneaker = useCallback(
    async (payload) => {
      const nextId = Math.max(0, ...(sneakerRes.data ?? []).map((s) => Number(s.id))) + 1
      const created = { id: nextId, ...payload }
      sneakerRes.setData((prev) => [...(prev ?? []), created])
      fetch('/sneakers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {})
    },
    [sneakerRes],
  )

  const updateSneaker = useCallback(
    async (id, partial) => {
      sneakerRes.setData((prev) =>
        (prev ?? []).map((s) => (String(s.id) === String(id) ? { ...s, ...partial } : s)),
      )
      fetch(`/sneakers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partial),
      }).catch(() => {})
    },
    [sneakerRes],
  )

  const deleteSneaker = useCallback(
    async (id) => {
      sneakerRes.setData((prev) => (prev ?? []).filter((s) => String(s.id) !== String(id)))
      fetch(`/sneakers/${id}`, { method: 'DELETE' }).catch(() => {})
    },
    [sneakerRes],
  )

  const value = useMemo(
    () => ({
      storeInfo,
      sneakers,
      loading,
      error,
      refreshAll,
      addSneaker,
      updateSneaker,
      deleteSneaker,
    }),
    [storeInfo, sneakers, loading, error, refreshAll, addSneaker, updateSneaker, deleteSneaker],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
