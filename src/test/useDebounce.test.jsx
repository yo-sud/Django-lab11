import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebounce } from '../hooks/useDebounce.js'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('devuelve el valor inicial y lo actualiza después del retardo', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'dune' },
    })

    expect(result.current).toBe('dune')

    rerender({ value: 'oppenheimer' })
    expect(result.current).toBe('dune')

    act(() => {
      vi.advanceTimersByTime(299)
    })
    expect(result.current).toBe('dune')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe('oppenheimer')
  })

  it('cancela el temporizador anterior cuando el valor cambia rápido', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 200), {
      initialProps: { value: '' },
    })

    rerender({ value: 'b' })
    act(() => {
      vi.advanceTimersByTime(100)
    })
    rerender({ value: 'ba' })
    act(() => {
      vi.advanceTimersByTime(100)
    })
    rerender({ value: 'bar' })
    act(() => {
      vi.advanceTimersByTime(199)
    })
    expect(result.current).toBe('')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe('bar')
  })
})
