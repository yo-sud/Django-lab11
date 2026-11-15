import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePremieres } from '../hooks/usePremieres.js'

describe('usePremieres', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('empieza cargando y termina con datos adaptados', () => {
    const { result } = renderHook(() => usePremieres({ delay: 100 }))

    expect(result.current.state).toBe('loading')
    expect(result.current.data).toEqual([])
    expect(result.current.error).toBeNull()

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current.state).toBe('success')
    expect(result.current.data.length).toBeGreaterThan(0)
    expect(result.current.data[0]).toMatchObject({
      isNew: true,
      badgeText: 'Estreno',
    })
  })

  it('expone el estado de error cuando la petición simulada falla', () => {
    const { result } = renderHook(() => usePremieres({ delay: 100, shouldFail: true }))

    expect(result.current.state).toBe('loading')

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current.state).toBe('error')
    expect(result.current.error).toMatchObject({ code: 'NETWORK_ERROR' })
    expect(result.current.data).toEqual([])
  })

  it('permite reintentar y volver a cargar los datos', () => {
    const { result, rerender } = renderHook(
      ({ shouldFail }) => usePremieres({ delay: 100, shouldFail }),
      { initialProps: { shouldFail: true } }
    )

    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current.state).toBe('error')

    rerender({ shouldFail: false })
    expect(result.current.state).toBe('loading')

    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current.state).toBe('success')
  })
})
