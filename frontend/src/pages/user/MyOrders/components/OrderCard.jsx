import { Link } from 'react-router-dom';
import { Shirt, Check } from 'lucide-react';

const STATUS_LABELS = {
  confirmed: { label: 'Confirmed', badge: 'neutral' },
  pattern: { label: 'Pattern', badge: 'info' },
  stitching: { label: 'Stitching', badge: 'warning' },
  qc: { label: 'QC', badge: 'warning' },
  shipped: { label: 'Shipped', badge: 'info' },
  delivered: { label: 'Delivered', badge: 'success' },
};

const OrderCard = ({ order, submitted, onFeedback }) => {
  const statusInfo = STATUS_LABELS[order.status] || { label: order.status, badge: 'neutral' };
  const canFeedback = order.status === 'delivered' && !submitted.has(order._id);
  const trackUrl = `/orders/${order._id}`;
  const primaryImage = order.productId?.primaryImage;

  return (
    <div className="my-order-card card">

      {/* Image — clicks to track order */}
      <Link to={trackUrl} className="my-order-image">
        {primaryImage ? (
          <img
            src={`http://localhost:5001${primaryImage}`}
            alt={order.productId?.name || 'Product'}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            <Shirt size={36} color="var(--color-gold-muted)" />
          </div>
        )}
      </Link>

      <div className="my-order-details">
        <div className="my-order-header">
          <div>
            <p className="my-order-name">{order.productId?.name || 'Custom Garment'}</p>
            <p className="my-order-id">Order ID: {order.orderId}</p>
          </div>
          <span className={`badge badge--${statusInfo.badge}`}>{statusInfo.label}</span>
        </div>

        <div className="my-order-specs">
          {order.selectedFabric && <span className="spec-item">Fabric: {order.selectedFabric}</span>}
          {order.selectedColor && <span className="spec-item">Color: {order.selectedColor}</span>}
          {order.fitPreference && <span className="spec-item">Fit: {order.fitPreference}</span>}
        </div>

        <div className="my-order-footer">
          <span className="my-order-price">&#8377;{order.totalPrice?.toLocaleString('en-IN')}</span>
          <div className="my-order-actions">
            <Link to={trackUrl} className="btn btn--outline btn--sm">Track Order</Link>
            {canFeedback && (
              <button className="btn btn--primary btn--sm" onClick={() => onFeedback(order)}>Write Review</button>
            )}
            {submitted.has(order._id) && (
              <span className="badge badge--success" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Check size={12} /> Reviewed
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
