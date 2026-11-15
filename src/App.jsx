import { useEffect, useMemo, useState } from 'react'
import { useWindowSize } from './hooks/useWindowSize.js'
import { adaptMovies } from './utils/movieAdapter.js'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import MovieList from './components/MovieList.jsx'
import PremieresSection from './components/PremieresSection.jsx'
import FavoriteToast from './components/FavoriteToast.jsx'
import Footer from './components/Footer.jsx'
import { movies as rawMovies } from './data/movies.js'

const FAVORITES_KEY = 'cine-plus:favorites'

const loadFavorites = () => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY)
    const parsed = stored ? JSON.parse(stored) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function App() {
  const [tickets, setTickets] = useState(0)
  const [favorites, setFavorites] = useState(loadFavorites)
  const [notification, setNotification] = useState(null)
  const [query, setQuery] = useState('')
  const { width } = useWindowSize()

  const columns = width >= 1200 ? 3 : width >= 768 ? 2 : 1
  const adaptedMovies = useMemo(() => adaptMovies(rawMovies), [])
  const featured = adaptedMovies[0] ?? null
  const favoritesCount = favorites.length

  const handleBuy = () => {
    setTickets((previous) => previous + 1)
  }

  const handleQueryChange = (value) => {
    console.log('[filtro]', value)
    setQuery(value)
  }

  const toggleFavorite = (movieId) => {
    const isFavorite = favorites.includes(movieId)

    setFavorites((previous) =>
      previous.includes(movieId)
        ? previous.filter((id) => id !== movieId)
        : [...previous, movieId]
    )
    setNotification({
      message: isFavorite ? 'Película quitada de favoritas' : 'Película añadida a favoritas',
      type: isFavorite ? 'info' : 'success',
    })
  }

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    if (!notification) return undefined

    const timer = setTimeout(() => setNotification(null), 2800)
    return () => clearTimeout(timer)
  }, [notification])

  return (
    <>
      <Header tickets={tickets} favoritesCount={favoritesCount} />
      <main>
        <Hero movie={featured} query={query} onQueryChange={handleQueryChange} />
        <PremieresSection />
        <MovieList
          movies={adaptedMovies}
          onBuy={handleBuy}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          query={query}
          onQueryChange={handleQueryChange}
          columns={columns}
        />
      </main>
      <Footer />
      <FavoriteToast notification={notification} onClose={() => setNotification(null)} />
    </>
  )
}

export default App
