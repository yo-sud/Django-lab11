import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App.jsx'

const setWindowWidth = (width) => {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width,
  })
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    writable: true,
    value: 900,
  })
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
    setWindowWidth(1280)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('eleva el contador de favoritas y muestra el aviso sin que la tarjeta lo renderice', () => {
    render(<App />)

    expect(screen.getByText('0 favoritas')).toBeInTheDocument()

    fireEvent.click(screen.getAllByRole('button', { name: /añadir a favoritas/i })[0])

    expect(screen.getByText('1 favorita')).toBeInTheDocument()
    expect(screen.getByText(/añadida a favoritas/i)).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('cine-plus:favorites'))).toEqual([1])

    fireEvent.click(screen.getByRole('button', { name: /en favoritas/i }))

    expect(screen.getByText('0 favoritas')).toBeInTheDocument()
    expect(screen.getByText(/quitada de favoritas/i)).toBeInTheDocument()
  })

  it('sincroniza el buscador del banner, el de la lista y el botón de limpiar', () => {
    render(<App />)

    const heroSearch = screen.getByLabelText(/buscar películas desde el banner/i)
    const listSearch = screen.getByLabelText(/buscar película por título/i)

    fireEvent.change(heroSearch, { target: { value: 'dune' } })
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(listSearch).toHaveValue('dune')
    const grid = () => screen.getByRole('list', { name: /películas en cartelera/i })
    expect(within(grid()).getByText('Dune: Parte Dos')).toBeInTheDocument()
    expect(within(grid()).queryByText('Oppenheimer')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /limpiar filtro/i }))

    expect(heroSearch).toHaveValue('')
    expect(listSearch).toHaveValue('')
    expect(within(grid()).getByText('Oppenheimer')).toBeInTheDocument()
  })

  it('usa useWindowSize para cambiar las tarjetas por fila', () => {
    render(<App />)

    const grid = () => screen.getByRole('list', { name: /películas en cartelera/i })
    expect(grid()).toHaveClass('movie-grid--3')

    act(() => {
      setWindowWidth(800)
      window.dispatchEvent(new Event('resize'))
    })
    expect(grid()).toHaveClass('movie-grid--2')

    act(() => {
      setWindowWidth(480)
      window.dispatchEvent(new Event('resize'))
    })
    expect(grid()).toHaveClass('movie-grid--1')
  })

  it('monta la sección de estrenos y resuelve la carga con el carrusel', () => {
    render(<App />)

    expect(screen.getByRole('status', { name: /cargando estrenos/i })).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1200)
    })

    const section = screen.getByRole('region', { name: /próximos estrenos/i })
    expect(within(section).getByRole('region', { name: /carrusel de estrenos/i })).toBeInTheDocument()
  })
})
