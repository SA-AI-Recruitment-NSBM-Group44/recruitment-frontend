export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel
}) {

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">

      <div className="modal">

        <h3>{title}</h3>

        <p>{message}</p>

        <div className="modal-actions">

          <button
            className="cancel-button"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="reject-button"
            onClick={onConfirm}
          >
            Reject
          </button>

        </div>

      </div>

    </div>
  );
}