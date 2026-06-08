const FitSelector = ({ fitPreference, onChange }) => (
  <div className="customize-section">
    <h3 className="customize-section-title">Fit Preference</h3>
    <div className="fit-selector">
      {['slim', 'regular', 'loose'].map((f) => (
        <button
          key={f}
          type="button"
          className={`fit-btn ${fitPreference === f ? 'active' : ''}`}
          onClick={() => onChange(f)}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)} Fit
        </button>
      ))}
    </div>
  </div>
);

export default FitSelector;
