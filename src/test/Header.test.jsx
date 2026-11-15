import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Header from '../components/Header.jsx'

describe('Header', () => {
  it('muestra los contadores que recibe, sin recibir la lista de favoritas', () => {
    render(<Header tickets={2} favoritesCount={3} />)

    expect(screen.getByText('2 entradas')).toBeInTheDocument()
    expect(screen.getByText('3 favoritas')).toBeInTheDocument()
  })

  it('usa singular cuando el contador vale uno', () => {
    render(<Header tickets={1} favoritesCount={1} />)

    expect(screen.getByText('1 entrada')).toBeInTheDocument()
    expect(screen.getByText('1 favorita')).toBeInTheDocument()
  })
})
