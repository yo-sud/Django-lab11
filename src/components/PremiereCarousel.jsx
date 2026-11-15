import { useEffect, useState } from 'react'
import { useWindowSize } from '../hooks/useWindowSize.js'
import Button from './Button.jsx'

const formatReleaseDate = (value) => {
  if (!value) return 'Fecha por confirmar'

  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return 'Fecha por confirmar'

  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function PremiereCarousel({ premieres }) {
  const { width } = useWindowSize()
  const perView = width >= 900 ? 2 : 1
  const maxIndex = Math.max(0, premieres.length - perView)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex((current) => Math.min(current, maxIndex))
  }, [maxIndex])

  if (!premieres.length) return null

  const slideWidth = 100 / perView
  const goTo = (nextIndex) => setIndex(Math.max(0, Math.min(maxIndex, nextIndex)))

  return (
    <div
      className="carousel"
      role="region"
      aria-label="Carrusel de estrenos"
      aria-roledescription="carrusel"
    >
      <div className="carousel__viewport">
        <ul
          className="carousel__track"
          style={{ transform: `translateX(-${index * slideWidth}%)` }}
        >
          {premieres.map((premiere, slideIndex) => {
            const isVisible = slideIndex >= index && slideIndex < index + perView

            return (
              <li
                key={premiere.id}
                className="carousel__slide"
                style={{ flex: `0 0 ${slideWidth}%` }}
                aria-hidden={!isVisible}
              >
                <article className="premiere">
                  <img
                    src={premiere.image}
                    alt={`Póster de ${premiere.title}`}
                    loading="lazy"
                  />
                  <div className="premiere__body">
                    <span className="premiere__badge">{premiere.badgeText}</span>
                    <h3 className="premiere__title">{premiere.title}</h3>
                    <p className="premiere__date">{formatReleaseDate(premiere.releaseDate)}</p>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="carousel__controls">
        <Button
          variant="ghost"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          aria-label="Estrenos anteriores"
        >
          Anterior
        </Button>
        <div className="carousel__dots" role="group" aria-label="Seleccionar grupo de estrenos">
          {Array.from({ length: maxIndex + 1 }, (_, dotIndex) => (
            <button
              key={dotIndex}
              type="button"
              className={`carousel__dot ${dotIndex === index ? 'is-active' : ''}`}
              onClick={() => goTo(dotIndex)}
              aria-label={`Ir al grupo ${dotIndex + 1}`}
              aria-pressed={dotIndex === index}
            />
          ))}
        </div>
        <Button
          variant="ghost"
          onClick={() => goTo(index + 1)}
          disabled={index === maxIndex}
          aria-label="Estrenos siguientes"
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}

export default PremiereCarousel
