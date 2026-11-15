import { useEffect, useRef, useState } from 'react'
import { useDebounce } from '../hooks/useDebounce.js'

/**
 * Entrada de búsqueda controlada y reutilizable.
 *
 * El valor escrito se mantiene local para que el usuario vea cada tecla al
 * instante; `useDebounce` retrasa el aviso al padre. Cuando el padre limpia
 * el filtro, el valor externo se sincroniza con el input.
 */
function MovieSearch({ id, value, onChange, placeholder, label, delay = 300 }) {
  const [inputValue, setInputValue] = useState(value ?? '')
  const debouncedValue = useDebounce(inputValue, delay)
  const onChangeRef = useRef(onChange)
  const lastEmittedRef = useRef(value ?? '')

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    if (debouncedValue === lastEmittedRef.current) return

    lastEmittedRef.current = debouncedValue
    onChangeRef.current?.(debouncedValue)
  }, [debouncedValue])

  useEffect(() => {
    const nextValue = value ?? ''
    setInputValue(nextValue)
    lastEmittedRef.current = nextValue
  }, [value])

  return (
    <>
      <label className="visually-hidden" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type="search"
        className="movie-search__input"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        placeholder={placeholder}
      />
    </>
  )
}

export default MovieSearch
