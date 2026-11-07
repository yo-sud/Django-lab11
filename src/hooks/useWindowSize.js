/**
 * Hook personalizado useWindowSize
 * Rastrean el tamaño de la ventana del navegador y devuelven el ancho actual.
 * Útil para adaptar el diseño responsivo sin necesidad de media queries
 * inline o gestionar manualmente el evento resize.
 *
 * @returns Objeto con ancho y alto actuales de la ventana
 */
export const useWindowSize = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)

    // Ejecutar una vez al iniciar para establecer el tamaño inicial
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}