import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import MovieSearch from '../components/MovieSearch.jsx'

describe('MovieSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('retrasa el aviso al padre hasta que pasa el tiempo configurado', () => {
    const onChange = vi.fn()
    render(
      <MovieSearch
        id="search"
        value=""
        onChange={onChange}
        label="Buscar película"
        placeholder="Buscar..."
      />
    )

    fireEvent.change(screen.getByLabelText('Buscar película'), {
      target: { value: 'dune' },
    })

    expect(onChange).not.toHaveBeenCalled()
    act(() => {
      vi.advanceTimersByTime(299)
    })
    expect(onChange).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(onChange).toHaveBeenCalledWith('dune')
  })

  it('sincroniza el valor interno cuando el padre limpia el filtro', () => {
    const { rerender } = render(
      <MovieSearch
        id="search"
        value="dune"
        onChange={vi.fn()}
        label="Buscar película"
      />
    )

    const input = screen.getByLabelText('Buscar película')
    expect(input).toHaveValue('dune')

    rerender(
      <MovieSearch
        id="search"
        value=""
        onChange={vi.fn()}
        label="Buscar película"
      />
    )
    expect(input).toHaveValue('')
  })
})
