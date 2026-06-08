import { Link } from 'react-router-dom';
import { Ruler, RefreshCw } from 'lucide-react';
import { MEASUREMENT_LABELS } from '../../../../utils/measurementCalc';

const MeasurementsTab = ({ measurement }) => {
  if (!measurement) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon"><Ruler size={48} color="var(--color-border)" /></div>
        <h3 className="empty-state__title">No Measurements Saved</h3>
        <p>Take our quick measurement wizard to get started.</p>
        <Link to="/measure" className="btn btn--primary" style={{ marginTop: '1rem' }}>Get Measured</Link>
      </div>
    );
  }

  return (
    <>
      <div className="measurements-card card">
        <div className="measurements-card__header">
          <h3>Your Active Measurements</h3>
          <span className="badge badge--success">Active</span>
        </div>
        <div className="measurements-card__inputs">
          <div className="measurements-input-item"><span>Height</span><strong>{measurement.height} cm</strong></div>
          <div className="measurements-input-item"><span>Weight</span><strong>{measurement.weight} kg</strong></div>
          <div className="measurements-input-item"><span>Body Type</span><strong className="capitalize">{measurement.bodyType}</strong></div>
          <div className="measurements-input-item"><span>Fit Preference</span><strong className="capitalize">{measurement.fitPreference}</strong></div>
        </div>
        <div className="measurements-card__grid">
          {Object.entries(MEASUREMENT_LABELS).map(([key, { label, unit }]) => (
            <div key={key} className="measurements-card__item">
              <span className="measurements-card__label">{label}</span>
              <span className="measurements-card__value">
                {measurement[key] || '—'} <span style={{ fontSize: '0.65em', opacity: 0.6 }}>{unit}</span>
              </span>
            </div>
          ))}
        </div>
        {measurement.adjustmentDelta !== 0 && (
          <div className="measurements-card__note">
            <RefreshCw size={16} color="var(--color-gold-muted)" />
            <p>Adjusted by <strong>{measurement.adjustmentDelta > 0 ? '+' : ''}{measurement.adjustmentDelta} cm</strong> based on your feedback.</p>
          </div>
        )}
      </div>
      <Link to="/measure" className="btn btn--outline" style={{ marginTop: '1rem' }}>Update Measurements</Link>
    </>
  );
};

export default MeasurementsTab;
