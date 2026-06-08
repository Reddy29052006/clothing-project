import { useNavigate } from 'react-router-dom';
import { Ruler } from 'lucide-react';
import { MEASUREMENT_LABELS } from '../../../../utils/measurementCalc';

const MeasurementsSummary = ({ liveMeasurements }) => {
  const navigate = useNavigate();

  if (liveMeasurements) {
    return (
      <div className="customize-section">
        <h3 className="customize-section-title">
          Your Garment Dimensions
          <span className="badge badge--success" style={{ marginLeft: 8 }}>Personalized</span>
        </h3>
        <div className="measurements-mini-grid">
          {Object.entries(MEASUREMENT_LABELS).map(([key, { label, unit }]) => (
            <div key={key} className="measurements-mini-item">
              <span className="measurements-mini-label">{label}</span>
              <span className="measurements-mini-value">{liveMeasurements[key]} {unit}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="customize-section">
      <div className="customize-no-measurements">
        <Ruler size={24} color="var(--color-gold-muted)" />
        <div>
          <p>No measurements saved yet</p>
          <button className="btn btn--outline btn--sm" onClick={() => navigate('/measure')}>
            Get Measured First
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeasurementsSummary;
