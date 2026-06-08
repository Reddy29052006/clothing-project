const ColorPicker = ({ colors, selectedColor, onSelect }) => (
  <div className="customize-section">
    <h3 className="customize-section-title">
      Select Color {selectedColor && <span className="customize-selected-label">{selectedColor.name}</span>}
    </h3>
    <div className="color-swatches">
      {colors?.map((c) => (
        <button
          key={c.name}
          type="button"
          className={`color-swatch ${selectedColor?.name === c.name ? 'active' : ''} ${!c.available ? 'disabled' : ''}`}
          style={{ '--swatch-color': c.hex }}
          onClick={() => c.available && onSelect(c)}
          disabled={!c.available}
          title={c.name}
          aria-label={c.name}
        />
      ))}
    </div>
  </div>
);

export default ColorPicker;
