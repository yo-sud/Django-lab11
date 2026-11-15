import { useEffect, useState } from 'react'

/**
 * Retrasa la propagación de un valor.
 *
 * Se usa en `MovieSearch` para no escribir en el estado global de la
 * cartelera en cada tecla. El temporizador se cancela si el valor cambia
 * o si el componente se desmonta.
 *
 * @param {*} value Valor que se quiere retrasar.
 * @param {number} delay Retardo en milisegundos.
 * @returns {*} El último valor confirmado después del retardo.
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
