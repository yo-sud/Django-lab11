import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PremieresSection from '../components/PremieresSection.jsx'

describe('PremieresSection', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('muestra el esqueleto, luego el carrusel y permite simular el error', () => {
    render(<PremieresSection delay={50} />)

    expect(screen.getByRole('status', { name: /cargando estrenos/i })).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(50)
    })

    const carousel = screen.getByRole('region', { name: /próximos estrenos/i })
    expect(within(carousel).getByRole('region', { name: /carrusel de estrenos/i })).toBeInTheDocument()
    expect(within(carousel).getByText('Dune: Parte Dos')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /simular error/i }))
    expect(screen.getByRole('status', { name: /cargando estrenos/i })).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(50)
    })

    expect(screen.getByRole('alert')).toHaveTextContent(/no se pudieron cargar los estrenos/i)

    fireEvent.click(screen.getByRole('button', { name: /reintentar/i }))
    act(() => {
      vi.advanceTimersByTime(50)
    })

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('region', { name: /carrusel de estrenos/i })).toBeInTheDocument()
  })
})
