import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '../../../../services/productsApi';
import { ArrowRight, Star, Shirt } from 'lucide-react';

const StarRating = ({ rating }) => (
  <div className="stars" style={{ display: 'flex', gap: '2px', color: 'var(--color-gold)' }}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Star key={n} size={14} fill={n <= Math.round(rating) ? 'currentColor' : 'none'} strokeWidth={n <= Math.round(rating) ? 0 : 2} />
    ))}
  </div>
);

const FeaturedProducts = () => {
  const { data, isLoading } = useGetProductsQuery({ featured: true, limit: 4 });
  const products = data?.products || [];

  return (
    <section className="section featured-products" aria-labelledby="products-heading">
      <div className="container">
        <div className="featured-products__header reveal">
          <div>
            <span className="section-label">Curated Collection</span>
            <h2 id="products-heading" className="section-title">Crafted for Every Occasion</h2>
          </div>
          <Link to="/products" className="btn btn--outline">
            View All <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="featured-products__grid">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="product-card">
                <div className="product-card__image skeleton" style={{ height: 280 }} />
                <div className="product-card__info">
                  <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 18, width: '80%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 14, width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="featured-products__grid">
            {products.map((product, i) => (
              <Link key={product._id} to={`/products/${product._id}`} className={`product-card reveal delay-${(i % 4 + 1) * 100} visible`}>
                <div className="product-card__image">
                  {product.primaryImage ? (
                    <img src={`http://localhost:5001${product.primaryImage}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className="product-card__placeholder">
                      <Shirt size={48} color="var(--color-gold-muted)" />
                    </div>
                  )}
                  {product.featured && <span className="product-card__badge badge badge--gold">Featured</span>}
                  <div className="product-card__overlay"><span className="product-card__cta">Customize Now</span></div>
                </div>
                <div className="product-card__info">
                  <div className="product-card__meta">
                    <span className="product-card__category">{product.category}</span>
                    <StarRating rating={product.rating} />
                  </div>
                  <h3 className="product-card__name">{product.name}</h3>
                  <div className="product-card__footer">
                    <span className="product-card__price">Starting ₹{product.basePrice.toLocaleString('en-IN')}</span>
                    <span className="product-card__fabrics">{product.fabrics?.length || 0} fabrics</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
