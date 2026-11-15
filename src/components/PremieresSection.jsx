import { useState } from 'react'
import { usePremieres } from '../hooks/usePremieres.js'
import Button from './Button.jsx'
import PremiereCarousel from './PremiereCarousel.jsx'
import PremiereSkeleton from './PremiereSkeleton.jsx'

function PremieresSection({ delay = 1200 }) {
  const [simulateError, setSimulateError] = useState(false)
  const { state, data, error, reload } = usePremieres({ delay, shouldFail: simulateError })

  const handleRetry = () => {
    setSimulateError(false)
    reload()
  }

  return (
    <section
      className="premieres section"
      id="estrenos"
      aria-labelledby="premieres-title"
    >
      <div className="container">
        <div className="premieres__heading">
          <div>
            <span className="premieres__eyebrow">Muy pronto</span>
            <h2 id="premieres-title" className="section-title premieres__title">
              Próximos estrenos
            </h2>
          </div>
          <Button
            variant="ghost"
            onClick={() => setSimulateError((value) => !value)}
            aria-pressed={simulateError}
          >
            {simulateError ? 'Volver a cargar' : 'Simular error'}
          </Button>
        </div>

        <div className="premieres__content" aria-live="polite">
          {state === 'loading' && <PremiereSkeleton />}

          {state === 'error' && (
            <div className="alert alert--error" role="alert">
              <p>{error?.message ?? 'No se pudieron cargar los estrenos.'}</p>
              <Button variant="primary" onClick={handleRetry}>
                Reintentar
              </Button>
            </div>
          )}

          {state === 'success' && <PremiereCarousel premieres={data} />}
        </div>
      </div>
    </section>
  )
}

export default PremieresSection
