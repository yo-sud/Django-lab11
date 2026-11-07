/**
 * Hook personalizado usePremieres
 * Simula una petición asíncrona a un servicio de estrenos con tres estados:
 * cargando, con datos y con error. Sirve para demostrar la gestión de estados
 * en la interfaz y el uso de hooks personalizados que encapsulan lógica asíncrona.
 *
 * @param {number} delay - Tiempo en ms para simular la carga (default: 1000ms)
 * @param {number} errorChance - Probabilidad de error (default: 0.2)
 * @returns {object} Estado y datos del hook
 */
export const usePremieres = (delay = 1000, errorChance = 0.2) => {
  const [state, setState] = useState('loading')
  const [data, setData] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    setState('loading')
    setData([])
    setError(null)

    const timeout = setTimeout(() => {
      // Simular probabilidad de error
      if (Math.random() < errorChance) {
        setError({
          code: 'NETWORK_ERROR',
          message: 'No se pudieron cargar los estrenos. Inténtalo de nuevo.'
        })
        setState('error')
      } else {
        // Datos simulados de estrenos
        const simulatedData = [
          {
            id: 1,
            title: 'Dune: Parte Dos',
            image: '/posters/dune-parte-dos.jpg',
            releaseDate: '2024-03-15'
          },
          {
            id: 2,
            title: 'Deadpool 3',
            image: '/posters/deadpool-3.jpg',
            releaseDate: '2024-07-26'
          },
          {
            id: 3,
            title: 'Inside Out 2',
            image: '/posters/inside-out-2.jpg',
            releaseDate: '2024-06-14'
          }
        ]
        setData(simulatedData)
        setState('success')
      }
    }, delay)

    return () => clearTimeout(timeout)
  }, [])

  return { state, data, error }
}