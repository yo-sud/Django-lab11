import { useEffect, useState } from 'react'
import { useDebounce } from './hooks/useDebounce'
import { useWindowSize } from './hooks/useWindowSize'
import { usePremieres } from './hooks/usePremieres'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import MovieList from './components/MovieList.jsx'
import Footer from './components/Footer.jsx'
import { movies } from './data/movies.js'

const FAVORITES_KEY = 'cine-plus:favorites'

function App() {
  const [tickets, setTickets] = useState(0)
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  const [favoritesCount, setFavoritesCount] = useState(favorites.length)
  const [favNotification, setFavNotification] = useState({
    message: '',
    type: 'success'
  })
  const [query, setQuery] = useState('')
  const { width } = useWindowSize()
  const cols = width > 1200 ? 3 : width > 768 ? 2 : 1
  const featured = adaptMovie(movies[0])

  const adaptedMovies = movies.map(adaptMovie)

  const handleBuy = () => {
    setTickets((prev) => prev + 1)
  }

  const toggleFavorite = (movieId) => {
    setFavorites((prev) =>
      prev.includes(movieId) ? prev.filter((id) => id !== movieId) : [...prev, movieId]
    )
    setFavoritesCount(favorites.length + (prev.includes(movieId) ? -1 : 1))
    setFavNotification({
      message: prev.includes(movieId) ? 'Quita de favoritas' : 'Película añadida a favoritas',
      type: 'success'
    })
    setTimeout(() => setFavNotification({ message: '', type: 'success' }), 3000)
  }

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  }, [favorites])

  const { state, data, error } = usePremieres()

  const debouncedQuery = useDebounce(query, 300)

  const handleQueryChange = (value) => {
    console.log('[tecleo]', value)
    setQuery(value)
  }

  return (
    <>
      <Header tickets={tickets} favoritesCount={favoritesCount} />
      <main>
        <Hero movie={featured} query={query} onQueryChange={handleQueryChange} />
        <MovieList
          movies={movies}
          onBuy={handleBuy}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onFavoriteNotification={setFavNotification}
          query={query}
          onQueryChange={handleQueryChange}
          debouncedQuery={debouncedQuery}
        />
      </main>
      <Footer />
    </>
  )
}

export default App
