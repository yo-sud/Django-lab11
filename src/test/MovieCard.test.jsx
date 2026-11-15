import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import MovieCard from '../components/MovieCard.jsx'
import { adaptMovie } from '../utils/movieAdapter.js'

const movie = adaptMovie({
  id: 1,
  title: 'Dune: Parte Dos',
  poster: '/posters/dune-parte-dos.jpg',
  classification: 'PG-13',
  rating: 8.4,
  schedules: ['13:00', '16:30'],
})

describe('MovieCard', () => {
  it('avisa al padre al marcar una favorita sin conocer el mecanismo del aviso', () => {
    const onToggleFavorite = vi.fn()

    render(
      <MovieCard
        movie={movie}
        onBuy={vi.fn()}
        isFavorite={false}
        onToggleFavorite={onToggleFavorite}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /añadir a favoritas/i }))

    expect(onToggleFavorite).toHaveBeenCalledWith(1)
    expect(screen.queryByText(/añadida a favoritas/i)).not.toBeInTheDocument()
  })

  it('refleja el estado de favorita que recibe por props', () => {
    render(
      <MovieCard
        movie={movie}
        onBuy={vi.fn()}
        isFavorite
        onToggleFavorite={vi.fn()}
      />
    )

    const button = screen.getByRole('button', { name: /en favoritas/i })
    expect(button).toHaveAttribute('aria-pressed', 'true')
  })

  it('solo permite comprar después de elegir un horario', () => {
    const onBuy = vi.fn()
    render(
      <MovieCard
        movie={movie}
        onBuy={onBuy}
        isFavorite={false}
        onToggleFavorite={vi.fn()}
      />
    )

    const buyButton = screen.getByRole('button', { name: /comprar entrada/i })
    expect(buyButton).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: '13:00' }))
    expect(buyButton).toBeEnabled()

    fireEvent.click(buyButton)
    expect(onBuy).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: /entrada reservada/i })).toBeInTheDocument()
  })
})
