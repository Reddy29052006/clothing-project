import { Check } from 'lucide-react';

const FabricPicker = ({ fabrics, selectedFabric, onSelect }) => (
  <div className="customize-section">
    <h3 className="customize-section-title">
      Select Fabric {selectedFabric && <span className="customize-selected-label">{selectedFabric.name}</span>}
    </h3>
    <div className="fabric-grid">
      {fabrics?.map((f) => (
        <button
          key={f.name}
          type="button"
          className={`fabric-card ${selectedFabric?.name === f.name ? 'active' : ''} ${!f.available ? 'disabled' : ''}`}
          onClick={() => f.available && onSelect(f)}
          disabled={!f.available}
        >
          <div className="fabric-card__swatch" />
          <div className="fabric-card__info">
            <span className="fabric-card__name">{f.name}</span>
            <span className="fabric-card__texture">{f.texture}</span>
            {f.surcharge > 0 && <span className="fabric-card__surcharge">+&#8377;{f.surcharge}</span>}
          </div>
          {selectedFabric?.name === f.name && <span className="fabric-card__check"><Check size={14} /></span>}
        </button>
      ))}
    </div>
  </div>
);

export default FabricPicker;
