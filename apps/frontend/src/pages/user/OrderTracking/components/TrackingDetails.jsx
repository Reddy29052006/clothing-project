import { Link } from 'react-router-dom';
import { Shirt, AlertTriangle, ArrowLeft } from 'lucide-react';

const TrackingDetails = ({ order }) => (
  <div className="tracking-details">
    <div className="card">
      <h4 className="tracking-details__title">Item Details</h4>
      <div className="tracking-product">
        <Link to={order.productId?._id ? `/products/${order.productId._id}` : '#'} className="tracking-product__image">
          {order.productId?.primaryImage ? (
            <img
              src={`http://localhost:5001${order.productId.primaryImage}`}
              alt={order.productId?.name || 'Product'}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
              <Shirt size={36} color="var(--color-gold-muted)" />
            </div>
          )}
        </Link>
        <div>
          <p className="tracking-product__name">{order.productId?.name || 'Custom Garment'}</p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <span className="badge badge--neutral">{order.selectedFabric}</span>
            <span className="badge badge--neutral">{order.selectedColor}</span>
            <span className="badge badge--neutral">{order.fitPreference} fit</span>
          </div>
        </div>
      </div>
    </div>

    {order.measurements && (
      <div className="card">
        <h4 className="tracking-details__title">Your Measurements</h4>
        <div className="tracking-measurements">
          {Object.entries(order.measurements).map(([k, v]) => v ? (
            <div key={k} className="tracking-measurement-item">
              <span className="tracking-measurement-label">{k}</span>
              <span className="tracking-measurement-value">{v} cm</span>
            </div>
          ) : null)}
        </div>
      </div>
    )}

    <div className="card">
      <h4 className="tracking-details__title">Pricing</h4>
      <div className="tracking-price-row"><span>Base Price</span><span>₹{order.basePrice?.toLocaleString('en-IN')}</span></div>
      {order.fabricSurcharge > 0 && <div className="tracking-price-row"><span>Fabric Premium</span><span>₹{order.fabricSurcharge?.toLocaleString('en-IN')}</span></div>}
      <div className="divider" />
      <div className="tracking-price-row tracking-price-row--total"><span>Total</span><span>₹{order.totalPrice?.toLocaleString('en-IN')}</span></div>
    </div>

    {order.deliveryAddress && (
      <div className="card">
        <h4 className="tracking-details__title">Delivery Address</h4>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-loose)' }}>
          {order.deliveryAddress.street}<br />
          {order.deliveryAddress.city}, {order.deliveryAddress.state} — {order.deliveryAddress.pincode}
        </p>
      </div>
    )}

    <Link to="/dashboard" className="btn btn--outline" style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
      <ArrowLeft size={14} /> Back to Dashboard
    </Link>
  </div>
);

export default TrackingDetails;
