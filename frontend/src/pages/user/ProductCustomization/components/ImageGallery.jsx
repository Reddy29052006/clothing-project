import { useState } from 'react';
import { Shirt } from 'lucide-react';

const ImageGallery = ({ product, color }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageZoomed, setImageZoomed] = useState(false);

  return (
    <div className="customize-image-col">
      <div
        className={`customize-image-frame ${imageZoomed ? 'zoomed' : ''}`}
        onMouseEnter={() => setImageZoomed(true)}
        onMouseLeave={() => setImageZoomed(false)}
      >
        {product.images && product.images.length > 0 ? (
          <img
            src={`http://localhost:5001${product.images[currentImageIndex]}`}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div className="customize-image-placeholder">
            <Shirt size={80} color="var(--color-gold-muted)" />
            <p>{product.name}</p>
          </div>
        )}
        {color && <div className="customize-color-overlay" style={{ background: `${color.hex}25` }} />}
        <div className="customize-image-badge">
          <span className="badge badge--gold">{product.category}</span>
        </div>
      </div>

      {product.images && product.images.length > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {product.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              style={{
                width: '60px', height: '60px', borderRadius: '4px', overflow: 'hidden',
                border: currentImageIndex === idx ? '2px solid var(--color-primary)' : '2px solid transparent',
                flexShrink: 0, padding: 0, background: 'none', cursor: 'pointer',
              }}
            >
              <img src={`http://localhost:5001${img}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
