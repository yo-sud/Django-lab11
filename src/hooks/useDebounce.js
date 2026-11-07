/**
 * Hook personalizado useDebounce
 * Retarda el valor de un estado, útil para búsquedas que no deben
 * disparar el filtrado en cada tecla escrita.
 *
 * @param value Valor actual (texto del buscador)
 * @param delay Retardo en milisegundos (default: 300ms)
 * @returns Valor debounced (aplicado después del retardo)
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