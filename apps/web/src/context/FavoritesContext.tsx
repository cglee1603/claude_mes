import { createContext, useContext, useState, useCallback } from 'react'

export interface FavoriteItem {
  code: string
  path: string
  title: string
}

interface FavoritesContextValue {
  favorites: FavoriteItem[]
  addFavorite: (item: FavoriteItem) => void
  removeFavorite: (code: string) => void
  moveFavorite: (code: string, dir: -1 | 1) => void
  hasFavorite: (code: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextValue>({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  moveFavorite: () => {},
  hasFavorite: () => false,
})

const STORAGE_KEY = 'mes-favorites'

function load(): FavoriteItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as FavoriteItem[]
  } catch {
    return []
  }
}

function save(items: FavoriteItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(load)

  const addFavorite = useCallback((item: FavoriteItem) => {
    setFavorites(prev => {
      if (prev.some(f => f.code === item.code)) return prev
      const next = [...prev, item]
      save(next)
      return next
    })
  }, [])

  const removeFavorite = useCallback((code: string) => {
    setFavorites(prev => {
      const next = prev.filter(f => f.code !== code)
      save(next)
      return next
    })
  }, [])

  const moveFavorite = useCallback((code: string, dir: -1 | 1) => {
    setFavorites(prev => {
      const idx = prev.findIndex(f => f.code === code)
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const arr = [...prev];[arr[idx], arr[next]] = [arr[next], arr[idx]]
      save(arr)
      return arr
    })
  }, [])

  const hasFavorite = useCallback((code: string) => {
    return favorites.some(f => f.code === code)
  }, [favorites])

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, moveFavorite, hasFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => useContext(FavoritesContext)
