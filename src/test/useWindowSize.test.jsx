import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useWindowSize } from '../hooks/useWindowSize.js'

const setWindowWidth = (width) => {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width,
  })
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    writable: true,
    value: 800,
  })
}

describe('useWindowSize', () => {
  it('lee el tamaño inicial de la ventana', () => {
    setWindowWidth(1280)
    const { result } = renderHook(() => useWindowSize())

    expect(result.current).toEqual({ width: 1280, height: 800 })
  })

  it('escucha el evento resize y deja de hacerlo al desmontarse', () => {
    setWindowWidth(1024)
    const { result, unmount } = renderHook(() => useWindowSize())

    act(() => {
      setWindowWidth(640)
      window.dispatchEvent(new Event('resize'))
    })
    expect(result.current.width).toBe(640)

    unmount()
    act(() => {
      setWindowWidth(320)
      window.dispatchEvent(new Event('resize'))
    })
    expect(result.current.width).toBe(640)
  })
})
