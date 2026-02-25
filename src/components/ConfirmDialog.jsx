// Confirmation dialog for destructive actions like delete
import Modal from './Modal';

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Delete', loading = false }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
            <p className="text-sm text-slate-400 mb-6">{message}</p>
            <div className="flex items-center justify-end gap-3">
                <button onClick={onClose} className="btn-secondary" disabled={loading}>
                    Cancel
                </button>
                <button onClick={onConfirm} className="btn-danger" disabled={loading}>
                    {loading ? 'Processing...' : confirmLabel}
                </button>
            </div>
        </Modal>
    );
}

export default ConfirmDialog;
