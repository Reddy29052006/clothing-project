import { useParams, Link } from 'react-router-dom';
import { useGetProductByIdQuery } from '../../../services/productsApi';
import { ArrowLeft, Pencil, Shirt, Star } from 'lucide-react';
import './VendorProductDetail.css';

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

const VendorProductDetail = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetProductByIdQuery(id);
  const product = data?.product;

  if (isLoading) return <div className="spinner spinner--lg spinner--gold" style={{ margin: '6rem auto' }} />;
  if (isError || !product) return <div className="card container" style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--color-error)' }}>Product not found.</div>;

  return (
    <div className="vendor-detail-page container">
      <Link to="/vendor/products" className="btn btn--outline btn--sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        <ArrowLeft size={14} /> Back to Collection
      </Link>

      <div className="vendor-detail-header">
        <div>
          <span className="vendor-detail-category">{product.category}</span>
          <h1 className="vendor-detail-title">{product.name}</h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span className={`badge ${product.isActive ? 'badge--success' : 'badge--error'}`}>
              {product.isActive ? 'Active Listing' : 'Draft'}
            </span>
            {product.featured && <span className="badge badge--gold">Featured</span>}
          </div>
        </div>
        
        <Link to={`/vendor/products/edit/${product._id}`} className="btn btn--primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Pencil size={16} /> Edit Details
        </Link>
      </div>

      <div className="vendor-detail-grid">
        <div className="vendor-detail-image-box">
          {product.primaryImage ? (
            <img src={`http://localhost:5001${product.primaryImage}`} alt={product.name} className="vendor-detail-image" />
          ) : (
            <Shirt size={80} color="var(--color-border)" />
          )}
        </div>

        <div className="vendor-detail-info">
          <div className="vendor-detail-section">
            <h3 className="vendor-detail-section-title">Core Information</h3>
            <div className="vendor-data-row">
              <span className="vendor-data-label">Base Price</span>
              <span className="vendor-data-value">&#8377;{product.basePrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="vendor-data-row">
              <span className="vendor-data-label">Description</span>
              <span className="vendor-data-value" style={{ maxWidth: '60%', textAlign: 'right', fontWeight: 'normal', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
                {product.description || 'No description provided.'}
              </span>
            </div>
            <div className="vendor-data-row">
              <span className="vendor-data-label">Average Rating</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="vendor-data-value">{product.rating?.toFixed(1) || '0.0'}</span>
                {product.rating > 0 && <StarRating rating={product.rating} />}
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>({product.reviewCount || 0} reviews)</span>
              </div>
            </div>
          </div>

          <div className="vendor-detail-section">
            <h3 className="vendor-detail-section-title">Available Customizations</h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <span className="vendor-data-label" style={{ display: 'block', marginBottom: '0.75rem' }}>Fabrics Offered</span>
              {product.fabrics && product.fabrics.length > 0 ? (
                <div className="vendor-fabric-list">
                  {product.fabrics.map((f, i) => (
                    <div key={i} className="vendor-fabric-item">
                      {f.name} {f.surcharge > 0 ? `(+₹${f.surcharge})` : ''}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>No fabrics defined.</p>
              )}
            </div>

            <div>
              <span className="vendor-data-label" style={{ display: 'block', marginBottom: '0.75rem' }}>Colors Offered</span>
              {product.colors && product.colors.length > 0 ? (
                <div className="vendor-color-list">
                  {product.colors.map((c, i) => (
                    <div key={i} className="vendor-color-item">
                      <div className="vendor-color-swatch" style={{ backgroundColor: c.hex }}></div>
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
      <div className="vendor-detail-reviews">
        <div className="vendor-reviews-header">
          <h2 className="vendor-reviews-title">Customer Reviews</h2>
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
          <div className="vendor-reviews-grid">
            {product.reviews.map((review, i) => (
              <div key={i} className="vendor-review-card">
                <div className="vendor-review-card__header">
                  <div className="vendor-review-card__avatar">
                    {review.userName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="vendor-review-card__name">{review.userName || 'Customer'}</p>
                    <StarRating rating={review.rating} />
                  </div>
                  <span className="vendor-review-card__date" style={{ marginLeft: 'auto' }}>
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                  </span>
                </div>
                {review.comment && (
                  <p className="vendor-review-card__comment">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="vendor-reviews-empty">
            <Star size={36} color="var(--color-border)" style={{ margin: '0 auto 1rem' }} />
            <p>No reviews have been left for this product yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorProductDetail;
