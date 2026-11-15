import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import MovieList from '../components/MovieList.jsx'
import { adaptMovies } from '../utils/movieAdapter.js'

const rawMovies = [
  {
    id: 1,
    title: 'Dune: Parte Dos',
    poster: '/posters/dune-parte-dos.jpg',
    classification: 'PG-13',
    rating: 8.4,
    schedules: ['13:00'],
  },
  {
    id: 2,
    title: 'Oppenheimer',
    poster: '/posters/oppenheimer.jpg',
    classification: 'R',
    rating: 8.5,
    schedules: ['15:00'],
  },
]

const movies = adaptMovies(rawMovies)

describe('MovieList', () => {
  it('filtra por la búsqueda que ya vive en App y aplica las columnas recibidas', () => {
    render(
      <MovieList
        movies={movies}
        onBuy={vi.fn()}
        favorites={[]}
        onToggleFavorite={vi.fn()}
        query="dune"
        onQueryChange={vi.fn()}
        columns={2}
      />
    )

    expect(screen.getByText('Dune: Parte Dos')).toBeInTheDocument()
    expect(screen.queryByText('Oppenheimer')).not.toBeInTheDocument()
    expect(screen.getByRole('list', { name: /películas en cartelera/i })).toHaveClass(
      'movie-grid--2'
    )
  })

  it('muestra el estado vacío con el texto buscado', () => {
    render(
      <MovieList
        movies={movies}
        onBuy={vi.fn()}
        favorites={[]}
        onToggleFavorite={vi.fn()}
        query="zzz"
        onQueryChange={vi.fn()}
        columns={1}
      />
    )

    expect(screen.getByText(/no se encontraron películas que coincidan con «zzz»/i)).toBeInTheDocument()
  })

  it('notifica al padre cuando una tarjeta pide cambiar de favorita', () => {
    const onToggleFavorite = vi.fn()

    render(
      <MovieList
        movies={movies}
        onBuy={vi.fn()}
        favorites={[1]}
        onToggleFavorite={onToggleFavorite}
        query=""
        onQueryChange={vi.fn()}
        columns={3}
      />
    )

    const favoriteButtons = screen.getAllByRole('button', { name: /favoritas/i })
    fireEvent.click(favoriteButtons[0])

    expect(onToggleFavorite).toHaveBeenCalledWith(1)
  })
})
