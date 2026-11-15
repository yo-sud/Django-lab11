import Button from './Button.jsx'
import MovieSearch from './MovieSearch.jsx'

function Hero({ movie, query, onQueryChange }) {
  if (!movie) return null

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div
        className="hero__background"
        style={{ backgroundImage: `url(${movie.image})` }}
        aria-hidden="true"
      />
      <div className="container hero__content">
        <span className="hero__badge">Destacado</span>
        <h1 id="hero-title" className="hero__title">{movie.title}</h1>
        <p className="hero__synopsis">{movie.synopsis}</p>
        <div className="hero__meta">
          <span className="hero__classification">{movie.classification}</span>
          <span className="hero__rating">
            <span aria-hidden="true">★</span> {movie.rating}
          </span>
        </div>
        <div className="hero__search">
          <MovieSearch
            id="search-hero"
            value={query}
            onChange={onQueryChange}
            placeholder="Buscar en la cartelera..."
            label="Buscar películas desde el banner"
          />
          {query && (
            <Button
              variant="ghost"
              className="hero__clear-filter"
              onClick={() => onQueryChange('')}
            >
              Limpiar filtro
            </Button>
          )}
          <a href="#cartelera" className="btn btn--primary hero__cta">Ver cartelera</a>
        </div>
      </div>
    </section>
  )
}

export default Hero
