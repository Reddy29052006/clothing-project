import { X } from 'lucide-react';

const MeasurementsModal = ({ measurements, productName, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">Measurements — {productName}</h3>
          <button className="btn btn--ghost btn--icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="vendor-measurements-grid">
          {measurements && Object.entries(measurements).map(([key, val]) => val ? (
            <div key={key} className="vendor-measurement-item">
              <span className="vendor-measurement-label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              <span className="vendor-measurement-value">{val} cm</span>
            </div>
          ) : null)}
        </div>
        <button className="btn btn--primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem' }} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default MeasurementsModal;
