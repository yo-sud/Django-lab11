import { useCallback, useEffect, useState } from 'react'
import { premieres as rawPremieres } from '../data/premieres.js'
import { adaptPremiere } from '../utils/movieAdapter.js'

/**
 * Simula la petición de los estrenos y expone sus tres estados.
 *
 * - `loading`: la petición está en curso.
 * - `success`: llegaron datos ya adaptados al modelo de la aplicación.
 * - `error`: la petición simulada falló y se puede reintentar.
 *
 * @param {{ delay?: number, shouldFail?: boolean }} options
 * @returns {{ state: 'loading'|'success'|'error', data: object[], error: object|null, reload: Function }}
 */
export const usePremieres = ({ delay = 1200, shouldFail = false } = {}) => {
  const [state, setState] = useState('loading')
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  const reload = useCallback(() => {
    setReloadKey((key) => key + 1)
  }, [])

  useEffect(() => {
    let cancelled = false

    setState('loading')
    setData([])
    setError(null)

    const timer = setTimeout(() => {
      if (cancelled) return

      if (shouldFail) {
        setError({
          code: 'NETWORK_ERROR',
          message: 'No se pudieron cargar los estrenos. Inténtalo de nuevo.',
        })
        setState('error')
        return
      }

      const adapted = rawPremieres.map(adaptPremiere).filter(Boolean)
      setData(adapted)
      setState('success')
    }, delay)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [delay, shouldFail, reloadKey])

  return { state, data, error, reload }
}
