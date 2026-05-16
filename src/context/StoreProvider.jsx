import {
  useCallback,
  useMemo,
} from 'react'
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

  const reloadStore = storeRes.reload
  const reloadCoffee = coffeeRes.reload

  const refreshAll = useCallback(async () => {
    await Promise.all([reloadStore(), reloadCoffee()])
  }, [reloadStore, reloadCoffee])

  const addCoffee = useCallback(
    async (payload) => {
      const res = await fetch('/coffee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Could not add product')
      await reloadCoffee()
    },
    [reloadCoffee],
  )

  const updateCoffee = useCallback(
    async (id, partial) => {
      const res = await fetch(`/coffee/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partial),
      })
      if (!res.ok) throw new Error('Could not update product')
      await reloadCoffee()
    },
    [reloadCoffee],
  )

  const deleteCoffee = useCallback(
    async (id) => {
      const res = await fetch(`/coffee/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Could not delete product')
      await reloadCoffee()
    },
    [reloadCoffee],
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
    [
      storeInfo,
      coffees,
      loading,
      error,
      refreshAll,
      addCoffee,
      updateCoffee,
      deleteCoffee,
    ],
  )

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  )
}
