/**
 * Adaptador de datos de películas
 * Convierte el formato bruto de la cartelera al modelo interno de la aplicación.
 * Centraliza la transformación de datos para que los componentes no tengan que
 * preocuparse por las diferencias de estructura entre el servidor, el almacenamiento
 * local y la presentación visual.
 */

export const adaptMovie = (rawMovie) => {
  if (!rawMovie) return null

  return {
    id: rawMovie.id,
    title: rawMovie.title,
    image: rawMovie.image || rawMovie.poster,
    synopsis: rawMovie.synopsis,
    classification: rawMovie.classification || rawMovie.rating,
    rating: typeof rawMovie.rating === 'number' ? rawMovie.rating : 0,
    schedule: rawMovie.schedule || [],
    // Derivados del adaptador para evitar cálculos en los componentes
    isFavorite: false,
    watchTime: null,
  }
}

/**
 * Adaptador para el modo premiere (datos simulados)
 * Añade metadatos específicos para la sección de estrenos.
 */
export const adaptPremiere = (rawMovie) => ({
  ...adaptMovie(rawMovie),
  isNew: true,
  badgeText: 'Nuevo',
  badgeColor: 'var(--color-accent)',
})

/**
 * Limpia datos redundantes que no necesita la vista
 */
export const cleanMovieData = (movie) => ({
  id: movie.id,
  title: movie.title,
  image: movie.image,
})