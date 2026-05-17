import { useCallback, useMemo } from 'react'
import { StoreContext } from './storeContext.js'
import { useFetchJson } from '../hooks/useFetchJson.js'

// Fetches /db.json (static file served by Vercel) instead of json-server routes.
// Mutations update local state optimistically — network calls are fire-and-forget
// so they work on static hosts without a running server.
export function StoreProvider({ children }) {
  const dbRes = useFetchJson('/db.json')

  const loading = dbRes.loading
  const error = dbRes.error

  const storeInfo = useMemo(() => {
    const rows = dbRes.data?.store_info
    if (!Array.isArray(rows) || rows.length === 0) return null
    return rows[0]
  }, [dbRes.data])

  const sneakers = useMemo(() => {
    const rows = dbRes.data?.sneakers
    return Array.isArray(rows) ? rows : []
  }, [dbRes.data])

  const refreshAll = useCallback(async () => {
    await dbRes.reload()
  }, [dbRes])

  const addSneaker = useCallback(
    async (payload) => {
      const nextId =
        Math.max(0, ...(dbRes.data?.sneakers ?? []).map((s) => Number(s.id))) + 1
      const created = { id: nextId, ...payload }
      dbRes.setData((prev) => ({
        ...prev,
        sneakers: [...(prev?.sneakers ?? []), created],
      }))
      fetch('/sneakers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {})
    },
    [dbRes],
  )

  const updateSneaker = useCallback(
    async (id, partial) => {
      dbRes.setData((prev) => ({
        ...prev,
        sneakers: (prev?.sneakers ?? []).map((s) =>
          String(s.id) === String(id) ? { ...s, ...partial } : s,
        ),
      }))
      fetch(`/sneakers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partial),
      }).catch(() => {})
    },
    [dbRes],
  )

  const deleteSneaker = useCallback(
    async (id) => {
      dbRes.setData((prev) => ({
        ...prev,
        sneakers: (prev?.sneakers ?? []).filter((s) => String(s.id) !== String(id)),
      }))
      fetch(`/sneakers/${id}`, { method: 'DELETE' }).catch(() => {})
    },
    [dbRes],
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