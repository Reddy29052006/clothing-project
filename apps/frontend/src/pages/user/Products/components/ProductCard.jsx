import { Link } from 'react-router-dom';
import { Shirt, ArrowRight } from 'lucide-react';
import { getImageUrl } from '../../../../utils/imageHelper';

const StarRating = ({ rating }) => (
  <div className="stars">
    {[1, 2, 3, 4, 5].map((n) => (
      <span key={n} className={`star ${n <= Math.round(rating) ? 'star--filled' : ''}`}>&#9733;</span>
    ))}
  </div>
);

const ProductCard = ({ product }) => (
  <Link to={`/products/${product._id}`} className="product-card-full">
    <div className="product-card-full__image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      {product.primaryImage ? (
        <img src={getImageUrl(product.primaryImage)} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <Shirt size={64} color="var(--color-gold-muted)" />
      )}
      {product.featured && (
        <span className="badge badge--gold product-card-full__featured" style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 2 }}>
          Featured
        </span>
      )}
      <div className="product-card-full__overlay"><span>Customize <ArrowRight size={14} /></span></div>
    </div>
    <div className="product-card-full__info">
      <div className="product-card-full__meta">
        <span className="product-card-full__category">{product.category}</span>
        <StarRating rating={product.rating} />
      </div>
      <h3 className="product-card-full__name">{product.name}</h3>
      <p className="product-card-full__desc">{product.description.substring(0, 80)}…</p>
      <div className="product-card-full__footer">
        <span className="product-card-full__price">From ₹{product.basePrice.toLocaleString('en-IN')}</span>
        <div className="product-card-full__dots">
          {product.colors?.slice(0, 5).map((c) => (
            <span key={c.name} className="product-card-full__color-dot" style={{ background: c.hex }} title={c.name} />
          ))}
        </div>
      </div>
    </div>
  </Link>
);

export default ProductCard;
