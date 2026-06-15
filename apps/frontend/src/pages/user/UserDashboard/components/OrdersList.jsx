import { Link } from 'react-router-dom';
import { Package, Shirt, Check, ArrowRight } from 'lucide-react';

const STATUS_LABELS = {
  confirmed: { label: 'Confirmed', badge: 'neutral' },
  pattern: { label: 'Pattern', badge: 'info' },
  stitching: { label: 'Stitching', badge: 'warning' },
  qc: { label: 'QC', badge: 'warning' },
  shipped: { label: 'Shipped', badge: 'info' },
  delivered: { label: 'Delivered', badge: 'success' },
};

const OrdersList = ({ orders, submitted, onFeedback }) => {
  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon"><Package size={48} color="var(--color-border)" /></div>
        <h3 className="empty-state__title">No Orders Yet</h3>
        <p>Start by browsing our collections and getting measured.</p>
        <Link to="/products" className="btn btn--primary" style={{ marginTop: '1rem' }}>Browse Collections</Link>
      </div>
    );
  }

  return (
    <>
      {orders.slice(0, 5).map((order) => {
        const statusInfo = STATUS_LABELS[order.status] || { label: order.status, badge: 'neutral' };
        const canFeedback = order.status === 'delivered' && !submitted.has(order._id);
        const primaryImage = order.productId?.primaryImage;
        const trackUrl = `/orders/${order._id}`;

        return (
          <div key={order._id} className="order-card card">
            <div className="order-card__image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Link to={trackUrl} className="my-order-image">
                {primaryImage ? (
                  <img
                    src={`${import.meta.env.VITE_BASE_URL || 'http://localhost:5001'}${primaryImage}`}
                    alt={order.productId?.name || 'Product'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                    <Shirt size={36} color="var(--color-gold-muted)" />
                  </div>
                )}
              </Link>
            </div>
            <div className="order-card__details">
              <div className="order-card__header">
                <div>
                  <h3 className="order-card__name">{order.productId?.name || 'Custom Garment'}</h3>
                  <p className="order-card__id">Order #{order.orderId}</p>
                </div>
                <span className={`badge badge--${statusInfo.badge}`}>{statusInfo.label}</span>
              </div>
              <div className="order-card__tags">
                {order.selectedFabric && <span className="badge badge--neutral">{order.selectedFabric}</span>}
                {order.selectedColor && <span className="badge badge--neutral">{order.selectedColor}</span>}
                {order.fitPreference && <span className="badge badge--neutral">{order.fitPreference} fit</span>}
              </div>
              <div className="order-card__footer">
                <span className="order-card__price">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
                <div className="order-card__actions">
                  <Link to={`/orders/${order._id}`} className="btn btn--outline btn--sm">Track <ArrowRight size={13} /></Link>
                  {canFeedback && (
                    <button className="btn btn--gold btn--sm" onClick={() => onFeedback(order)}>Give Feedback</button>
                  )}
                  {submitted.has(order._id) && <span className="badge badge--success"><Check size={12} /> Feedback Given</span>}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {orders.length > 5 && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/orders" className="btn btn--primary">View All Orders</Link>
        </div>
      )}
    </>
  );
};

export default OrdersList;
