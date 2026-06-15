import { Link } from 'react-router-dom';
import { Shirt, Plus } from 'lucide-react';
import { useGetTailorsProductsQuery } from '../../../services/tailorsApi';
import './TailorsCollection.css';

const TailorsCollection = () => {
  const { data, isLoading, isError } = useGetTailorsProductsQuery();
  const products = data?.products || [];

  return (
    <div className="tailors-collection-page">
      <div className="container">
        <div className="tailors-collection-header">
          <div>
            <h1 className="tailors-collection-title">My Collection</h1>
            <p className="tailors-collection-subtitle">Manage the garments you offer to your clients.</p>
          </div>
          <Link to="/tailors/products/add" className="btn btn--primary">
            <Plus size={16} style={{ marginRight: '0.5rem' }} /> Add New Product
          </Link>
        </div>

        {isLoading ? (
          <div className="spinner spinner--lg spinner--gold" style={{ margin: '6rem auto' }} />
        ) : isError ? (
          <div className="card" style={{ textAlign: 'center', color: 'var(--color-error)' }}>Failed to load collection.</div>
        ) : products.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Shirt size={48} color="var(--color-border)" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: 'var(--text-lg)' }}>Your collection is currently empty.</p>
            <Link to="/tailors/products/add" className="btn btn--primary">Start Building Your Collection</Link>
          </div>
        ) : (
          <div className="tailors-collection-grid">
            {products.map(product => (
              <div key={product._id} className="vc-card">
                <Link to={`/tailors/products/detail/${product._id}`} className="vc-card__image-wrap">
                  {product.primaryImage ? (
                    <img 
                      src={`${import.meta.env.VITE_BASE_URL || 'http://localhost:5001'}${product.primaryImage}`} 
                      alt={product.name}
                      className="vc-card__image" 
                    />
                  ) : (
                    <Shirt size={64} color="var(--color-gold-muted)" />
                  )}
                  {product.featured && <span className="vc-card__badge">Featured</span>}
                  
                  <div className={`vc-card__status ${product.isActive ? 'vc-card__status--active' : 'vc-card__status--draft'}`}>
                    {product.isActive ? 'Active' : 'Draft'}
                  </div>
                </Link>

                <div className="vc-card__content">
                  <div className="vc-card__meta">
                    <span className="vc-card__category">{product.category}</span>
                    <span className="vc-card__price">&#8377;{product.basePrice.toLocaleString('en-IN')}</span>
                  </div>

                  <h3 className="vc-card__title">{product.name}</h3>

                  <div className="vc-card__actions">
                    <Link to={`/tailors/products/edit/${product._id}`} className="btn btn--outline btn--sm vc-card__btn">
                      Edit details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TailorsCollection;
