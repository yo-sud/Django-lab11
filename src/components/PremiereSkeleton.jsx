function PremiereSkeleton({ count = 3 }) {
  return (
    <div
      className="premiere-skeleton"
      role="status"
      aria-label="Cargando estrenos"
      aria-busy="true"
    >
      <span className="visually-hidden">Cargando estrenos…</span>
      <ul className="premiere-skeleton__grid" aria-hidden="true">
        {Array.from({ length: count }, (_, index) => (
          <li key={index} className="premiere-skeleton__card">
            <div className="skeleton premiere-skeleton__image" />
            <div className="skeleton premiere-skeleton__line" />
            <div className="skeleton premiere-skeleton__line premiere-skeleton__line--short" />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PremiereSkeleton
