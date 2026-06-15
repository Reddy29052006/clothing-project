import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Pencil, Frown, Check, ArrowLeft, ChevronDown, Star, Ruler } from 'lucide-react';
import { selectIsAuthenticated, selectCurrentUser } from '../../../store/slices/authSlice';
import { addItem } from '../../../store/slices/cartSlice';
import { useGetProductByIdQuery } from '../../../services/productsApi';
import { useGetMyMeasurementQuery } from '../../../services/measurementsApi';
import { calculateMeasurements, MEASUREMENT_LABELS } from '../../../utils/measurementCalc';
import ImageGallery from './components/ImageGallery';
import FabricPicker from './components/FabricPicker';
import ColorPicker from './components/ColorPicker';
import FitSelector from './components/FitSelector';
import './ProductCustomization.css';

const StarRating = ({ rating }) => (
  <div className="customize-stars">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        size={16}
        fill={n <= Math.round(rating) ? 'currentColor' : 'none'}
        strokeWidth={n <= Math.round(rating) ? 0 : 1.5}
      />
    ))}
  </div>
);

const ProductCustomization = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  const { data: pd, isLoading: prodLoading, isError } = useGetProductByIdQuery(id);
  const { data: md } = useGetMyMeasurementQuery(undefined, { skip: !isAuthenticated });

  const product = pd?.product;
  const measurement = md?.measurement;

  const [selectedFabric, setSelectedFabric] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [fitPreference, setFitPreference] = useState(measurement?.fitPreference || 'regular');
  const [added, setAdded] = useState(false);
  const [measureOpen, setMeasureOpen] = useState(false);

  const fabric = selectedFabric ?? product?.fabrics?.[0];
  const color = selectedColor ?? product?.colors?.[0];

  const liveMeasurements = measurement
    ? calculateMeasurements(measurement.height, measurement.weight, measurement.bodyType, fitPreference)
    : null;

  const totalPrice = product ? product.basePrice + (fabric?.surcharge || 0) : 0;

  const handleAddToCart = () => {
    if (!product || !fabric || !color) return;
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!measurement) { navigate('/measure'); return; }

    dispatch(addItem({
      productId: product._id,
      productName: product.name,
      category: product.category,
      primaryImage: product.primaryImage || null,
      selectedFabric: fabric.name,
      selectedColor: color.name,
      selectedColorHex: color.hex,
      fitPreference,
      basePrice: product.basePrice,
      fabricSurcharge: fabric.surcharge || 0,
      totalPrice,
      measurements: liveMeasurements,
    }));

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (prodLoading) return (
    <div className="loading-screen">
      <div className="spinner spinner--lg spinner--gold" />
      <p style={{ color: 'var(--color-text-muted)', marginTop: '1rem' }}>Loading product&hellip;</p>
    </div>
  );

  if (isError || !product) return (
    <div className="loading-screen">
      <div className="empty-state">
        <div className="empty-state__icon"><Frown size={48} color="var(--color-border)" /></div>
        <h3 className="empty-state__title">Product Not Found</h3>
        <button className="btn btn--primary" onClick={() => navigate('/products')} style={{ marginTop: '1rem' }}>
          <ArrowLeft size={14} /> Back to Collections
        </button>
      </div>
    </div>
  );

  return (
    <div className="customize-page">
      <div className="customize-breadcrumb container">
        <button className="btn btn--ghost btn--sm" onClick={() => navigate(isOwner ? '/tailors/products' : '/products')}>
          <ArrowLeft size={14} /> Collections
        </button>
        <span className="customize-breadcrumb__sep">/</span>
        <span className="customize-breadcrumb__current">{product.name}</span>
      </div>

      {/* ── Main Grid: Image + Options ─────────────────────── */}
      <div className="customize-grid container">

        {/* Left — Image */}
        <div className="customize-image-col">
          <ImageGallery product={product} color={color} />
        </div>

        {/* Right — Customization Options */}
        <div className="customize-options-col">
          <div className="customize-header">
            <span className="section-label">{product.category}</span>
            <h1 className="customize-title">{product.name}</h1>
            <p className="customize-description">{product.description}</p>

            {/* Inline rating summary */}
            {product.rating > 0 && (
              <div className="customize-rating-inline">
                <StarRating rating={product.rating} />
                <span className="customize-rating-count">{product.rating.toFixed(1)} · {product.reviewCount || 0} reviews</span>
              </div>
            )}
          </div>

          <FabricPicker fabrics={product.fabrics} selectedFabric={fabric} onSelect={setSelectedFabric} />
          <ColorPicker colors={product.colors} selectedColor={color} onSelect={setSelectedColor} />
          <FitSelector fitPreference={fitPreference} onChange={setFitPreference} />

          {/* ── Measurements Accordion ──────────────────────── */}
          <div className="customize-section">
              <button
              className="customize-accordion-toggle"
              onClick={() => setMeasureOpen((o) => !o)}
              aria-expanded={measureOpen}
            >
              <span className="customize-section-title" style={{ margin: 0 }}>
                <Ruler size={16} />
                Your Garment Dimensions
                {liveMeasurements && (
                  <span className="badge badge--success" style={{ marginLeft: 8 }}>Personalized</span>
                )}
              </span>
              <ChevronDown
                size={18}
                style={{
                  transform: measureOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.25s ease',
                  color: 'var(--color-text-muted)',
                }}
              />
            </button>

            {measureOpen && (
              <div className="customize-accordion-body">
                {liveMeasurements ? (
                  <div className="measurements-mini-grid">
                    {Object.entries(MEASUREMENT_LABELS).map(([key, { label, unit }]) => (
                      <div key={key} className="measurements-mini-item">
                        <span className="measurements-mini-label">{label}</span>
                        <span className="measurements-mini-value">{liveMeasurements[key]} {unit}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="customize-no-measurements">
                    <Ruler size={24} color="var(--color-gold-muted)" />
                    <div>
                      <p>No measurements saved yet</p>
                      <button className="btn btn--outline btn--sm" onClick={() => navigate('/measure')}>
                        Get Measured First
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── CTA ─────────────────────────────────────────── */}
          <div className="customize-cta">
            <div className="customize-price">
              <span className="customize-price__label">Total Price</span>
              <span className="customize-price__amount">&#8377;{totalPrice.toLocaleString('en-IN')}</span>
              {fabric?.surcharge > 0 && (
                <span className="customize-price__breakdown">
                  &#8377;{product.basePrice.toLocaleString('en-IN')} + &#8377;{fabric.surcharge} fabric
                </span>
              )}
            </div>
            <button
              className={`btn btn--primary btn--lg customize-add-btn ${added ? 'added' : ''}`}
              onClick={handleAddToCart}
            >
              {added ? <><Check size={16} /> Added to Cart</> : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Reviews Section (full width below grid) ─────────── */}
      <div className="customize-reviews-section container">
        <div className="customize-reviews-header">
          <h2 className="customize-reviews-title">Customer Reviews</h2>
          {product.rating > 0 && (
            <div className="customize-reviews-summary">
              <span className="customize-reviews-score">{product.rating.toFixed(1)}</span>
              <div>
                <StarRating rating={product.rating} />
                <span className="customize-rating-count">{product.reviewCount || 0} reviews</span>
              </div>
            </div>
          )}
        </div>

        {product.reviews && product.reviews.length > 0 ? (
          <div className="customize-reviews-grid">
            {product.reviews.map((review, i) => (
              <div key={i} className="customize-review-card card">
                <div className="customize-review-card__header">
                  <div className="customize-review-card__avatar">
                    {review.userName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="customize-review-card__name">{review.userName || 'Customer'}</p>
                    <StarRating rating={review.rating} />
                  </div>
                  <span className="customize-review-card__date" style={{ marginLeft: 'auto' }}>
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                  </span>
                </div>
                {review.comment && (
                  <p className="customize-review-card__comment">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="customize-reviews-empty">
            <Star size={36} color="var(--color-border)" />
            <p>No reviews yet. Be the first to order and review this product.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCustomization;
