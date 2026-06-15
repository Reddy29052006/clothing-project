import { useParams, Link } from 'react-router-dom';
import { useGetProductByIdQuery } from '../../../services/productsApi';
import { ArrowLeft, Pencil, Shirt, Star } from 'lucide-react';
import './TailorsProductDetail.css';

const StarRating = ({ rating }) => (
  <div style={{ display: 'flex', gap: '2px' }}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        size={14}
        fill={n <= Math.round(rating) ? 'var(--color-gold)' : 'none'}
        stroke="var(--color-gold)"
        strokeWidth={n <= Math.round(rating) ? 0 : 1.5}
      />
    ))}
  </div>
);

const TailorsProductDetail = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetProductByIdQuery(id);
  const product = data?.product;

  if (isLoading) return <div className="spinner spinner--lg spinner--gold" style={{ margin: '6rem auto' }} />;
  if (isError || !product) return <div className="card container" style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--color-error)' }}>Product not found.</div>;

  return (
    <div className="tailors-detail-page container">
      <Link to="/tailors/products" className="btn btn--outline btn--sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        <ArrowLeft size={14} /> Back to Collection
      </Link>

      <div className="tailors-detail-header">
        <div>
          <span className="tailors-detail-category">{product.category}</span>
          <h1 className="tailors-detail-title">{product.name}</h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span className={`badge ${product.isActive ? 'badge--success' : 'badge--error'}`}>
              {product.isActive ? 'Active Listing' : 'Draft'}
            </span>
            {product.featured && <span className="badge badge--gold">Featured</span>}
          </div>
        </div>
        
        <Link to={`/tailors/products/edit/${product._id}`} className="btn btn--primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Pencil size={16} /> Edit Details
        </Link>
      </div>

      <div className="tailors-detail-grid">
        <div className="tailors-detail-image-box">
          {product.primaryImage ? (
            <img src={`${import.meta.env.VITE_BASE_URL}${product.primaryImage}`} alt={product.name} className="tailors-detail-image" />
          ) : (
            <Shirt size={80} color="var(--color-border)" />
          )}
        </div>

        <div className="tailors-detail-info">
          <div className="tailors-detail-section">
            <h3 className="tailors-detail-section-title">Core Information</h3>
            <div className="tailors-data-row">
              <span className="tailors-data-label">Base Price</span>
              <span className="tailors-data-value">&#8377;{product.basePrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="tailors-data-row">
              <span className="tailors-data-label">Description</span>
              <span className="tailors-data-value" style={{ maxWidth: '60%', textAlign: 'right', fontWeight: 'normal', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
                {product.description || 'No description provided.'}
              </span>
            </div>
            <div className="tailors-data-row">
              <span className="tailors-data-label">Average Rating</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="tailors-data-value">{product.rating?.toFixed(1) || '0.0'}</span>
                {product.rating > 0 && <StarRating rating={product.rating} />}
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>({product.reviewCount || 0} reviews)</span>
              </div>
            </div>
          </div>

          <div className="tailors-detail-section">
            <h3 className="tailors-detail-section-title">Available Customizations</h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <span className="tailors-data-label" style={{ display: 'block', marginBottom: '0.75rem' }}>Fabrics Offered</span>
              {product.fabrics && product.fabrics.length > 0 ? (
                <div className="tailors-fabric-list">
                  {product.fabrics.map((f, i) => (
                    <div key={i} className="tailors-fabric-item">
                      {f.name} {f.surcharge > 0 ? `(+₹${f.surcharge})` : ''}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>No fabrics defined.</p>
              )}
            </div>

            <div>
              <span className="tailors-data-label" style={{ display: 'block', marginBottom: '0.75rem' }}>Colors Offered</span>
              {product.colors && product.colors.length > 0 ? (
                <div className="tailors-color-list">
                  {product.colors.map((c, i) => (
                    <div key={i} className="tailors-color-item">
                      <div className="tailors-color-swatch" style={{ backgroundColor: c.hex }}></div>
                      {c.name}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>No colors defined.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Reviews Section ───────────────────────────────────── */}
      <div className="tailors-detail-reviews">
        <div className="tailors-reviews-header">
          <h2 className="tailors-reviews-title">Customer Reviews</h2>
          {product.rating > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)' }}>
                {product.rating.toFixed(1)}
              </span>
              <div>
                <StarRating rating={product.rating} />
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  Based on {product.reviewCount || 0} reviews
                </span>
              </div>
            </div>
          )}
        </div>

        {product.reviews && product.reviews.length > 0 ? (
          <div className="tailors-reviews-grid">
            {product.reviews.map((review, i) => (
              <div key={i} className="tailors-review-card">
                <div className="tailors-review-card__header">
                  <div className="tailors-review-card__avatar">
                    {review.userName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="tailors-review-card__name">{review.userName || 'Customer'}</p>
                    <StarRating rating={review.rating} />
                  </div>
                  <span className="tailors-review-card__date" style={{ marginLeft: 'auto' }}>
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                  </span>
                </div>
                {review.comment && (
                  <p className="tailors-review-card__comment">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="tailors-reviews-empty">
            <Star size={36} color="var(--color-border)" style={{ margin: '0 auto 1rem' }} />
            <p>No reviews have been left for this product yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TailorsProductDetail;
