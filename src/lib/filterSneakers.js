export const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop&q=80',
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop&q=80',
  'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=500&h=500&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&h=500&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500&h=500&fit=crop&q=80',
  'https://images.unsplash.com/photo-1584735175315-9d5df23be664?w=500&h=500&fit=crop&q=80',
  'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop&q=80',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&h=500&fit=crop&q=80',
]

export const HERO_IMAGE =
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&h=700&fit=crop&q=80'

export const STORY_IMAGE =
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&h=700&fit=crop&q=80'

export function pickFallbackImage(seed = 0) {
  return FALLBACK_IMAGES[Math.abs(seed) % FALLBACK_IMAGES.length]
}

/**
 * Filters sneaker catalog by search text, single category, and max price.
 * `origin` holds the category (Running, Lifestyle, Court, Trail).
 */
export function filterSneakers(sneakers, debouncedSearch, activeCategory, maxPrice) {
  const q = debouncedSearch.trim().toLowerCase()
  return sneakers.filter((s) => {
    if (activeCategory !== 'all' && s.origin !== activeCategory) return false
    if (Number(s.price) > maxPrice) return false
    if (!q) return true
    const blob = `${s.name} ${s.description} ${s.origin} ${s.tag ?? ''}`.toLowerCase()
    return blob.includes(q)
  })
}

export const PRICE_MIN = 80
export const PRICE_MAX = 160
