/**
 * Patrón adaptador: traduce los datos crudos (API, almacenamiento o datos
 * locales) al modelo único que consumen los componentes de la aplicación.
 *
 * Los componentes nunca leen `poster` o `schedules`: reciben siempre
 * `image` y `schedule`, de modo que un cambio en el origen de datos solo
 * obliga a tocar este archivo.
 */

const PLACEHOLDER = '/posters/placeholder.svg'

const asText = (value, fallback) => {
  if (typeof value === 'string' && value.trim()) return value.trim()
  return fallback
}

const asNumber = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const asList = (value) => (Array.isArray(value) ? [...value] : [])

export const adaptMovie = (rawMovie) => {
  if (!rawMovie || typeof rawMovie !== 'object') return null

  return {
    id: rawMovie.id ?? rawMovie._id ?? rawMovie.slug ?? null,
    title: asText(rawMovie.title ?? rawMovie.titulo, 'Película sin título'),
    image: asText(rawMovie.image ?? rawMovie.poster ?? rawMovie.posterUrl, PLACEHOLDER),
    synopsis: asText(rawMovie.synopsis ?? rawMovie.sinopsis ?? rawMovie.overview, ''),
    classification: asText(
      rawMovie.classification ?? rawMovie.clasificacion ?? rawMovie.rated,
      'N/A'
    ),
    rating: asNumber(rawMovie.rating ?? rawMovie.vote_average ?? rawMovie.voteAverage),
    schedule: asList(rawMovie.schedule ?? rawMovie.schedules ?? rawMovie.horarios),
    releaseDate: rawMovie.releaseDate ?? rawMovie.release_date ?? null,
  }
}

export const adaptMovies = (rawMovies) =>
  Array.isArray(rawMovies) ? rawMovies.map(adaptMovie).filter(Boolean) : []

export const adaptPremiere = (rawPremiere) => {
  const movie = adaptMovie(rawPremiere)
  if (!movie) return null

  return {
    ...movie,
    isNew: true,
    badgeText: 'Estreno',
  }
}
