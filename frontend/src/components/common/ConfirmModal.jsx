import "./ConfirmModal.css";

const ConfirmModal = ({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  isProcessing = false, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  isDestructive = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>
        
        <div className="modal-actions">
          <button 
            className="btn-modal-cancel" 
            onClick={onCancel}
            disabled={isProcessing}
          >
            {cancelText}
          </button>
          <button 
            className={`btn-modal-confirm ${isDestructive ? 'btn-destructive' : 'btn-primary'}`} 
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
