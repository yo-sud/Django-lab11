import { useEffect, useState } from 'react'

const getWindowSize = () => ({
  width: typeof window === 'undefined' ? 0 : window.innerWidth,
  height: typeof window === 'undefined' ? 0 : window.innerHeight,
})

/**
 * Devuelve el tamaño actual de la ventana y se actualiza al redimensionar.
 *
 * Se usa en `App` para decidir cuántas tarjetas caben por fila y en
 * `PremiereCarousel` para decidir cuántos estrenos se ven a la vez.
 *
 * @returns {{ width: number, height: number }}
 */
export const useWindowSize = () => {
  const [size, setSize] = useState(getWindowSize)

  useEffect(() => {
    const handleResize = () => setSize(getWindowSize())

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}
