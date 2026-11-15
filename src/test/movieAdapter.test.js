import { describe, expect, it } from 'vitest'
import { adaptMovie, adaptMovies, adaptPremiere } from '../utils/movieAdapter.js'

const rawMovie = {
  id: 7,
  title: 'Dune: Parte Dos',
  poster: '/posters/dune-parte-dos.jpg',
  synopsis: 'Paul Atreides en Arrakis.',
  classification: 'PG-13',
  rating: '8.4',
  schedules: ['13:00', '16:30'],
}

describe('movieAdapter', () => {
  it('traduce los campos crudos al modelo de la aplicación', () => {
    expect(adaptMovie(rawMovie)).toEqual({
      id: 7,
      title: 'Dune: Parte Dos',
      image: '/posters/dune-parte-dos.jpg',
      synopsis: 'Paul Atreides en Arrakis.',
      classification: 'PG-13',
      rating: 8.4,
      schedule: ['13:00', '16:30'],
      releaseDate: null,
    })
  })

  it('aplica valores por defecto sin inventar una clasificación numérica', () => {
    const adapted = adaptMovie({ id: 1, title: 'Sin datos' })

    expect(adapted.image).toBe('/posters/placeholder.svg')
    expect(adapted.classification).toBe('N/A')
    expect(adapted.rating).toBe(0)
    expect(adapted.schedule).toEqual([])
  })

  it('devuelve null para entradas inválidas y filtra la lista', () => {
    expect(adaptMovie(null)).toBeNull()
    expect(adaptMovie('texto')).toBeNull()
    expect(adaptMovies([rawMovie, null, undefined])).toHaveLength(1)
    expect(adaptMovies(null)).toEqual([])
  })

  it('marca los estrenos con su insignia sin perder el modelo base', () => {
    const premiere = adaptPremiere(rawMovie)

    expect(premiere).toMatchObject({
      id: 7,
      title: 'Dune: Parte Dos',
      isNew: true,
      badgeText: 'Estreno',
    })
  })
})
