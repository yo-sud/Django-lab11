function FavoriteToast({ notification, onClose }) {
  if (!notification?.message) return null

  const type = notification.type === 'info' ? 'info' : 'success'

  return (
    <div className={`toast toast--${type}`} role="status" aria-live="polite">
      <span className="toast__icon" aria-hidden="true">
        {type === 'info' ? '☆' : '♥'}
      </span>
      <p className="toast__message">{notification.message}</p>
      <button
        type="button"
        className="toast__close"
        onClick={onClose}
        aria-label="Cerrar aviso"
      >
        ×
      </button>
    </div>
  )
}

export default FavoriteToast
