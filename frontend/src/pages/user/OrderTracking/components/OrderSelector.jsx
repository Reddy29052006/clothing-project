import { Link } from 'react-router-dom';
import { Shirt, ArrowRight } from 'lucide-react';

const OrderSelector = ({ myOrders, myOrdersLoading, onSelect }) => {
  if (myOrdersLoading) return <div className="spinner spinner--gold" />;

  if (myOrders.length === 0) return (
    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
      <p>You have no active orders to track.</p>
      <Link to="/products" className="btn btn--primary" style={{ marginTop: '1rem' }}>Browse Collections</Link>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {myOrders.map(mo => (
        <div
          key={mo._id}
          className="card"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
          onClick={() => onSelect(mo._id)}
        >
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
            <div style={{ width: '50px', height: '50px', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shirt size={24} color="var(--color-gold-muted)" />
            </div>
            <div>
              <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: 'var(--text-lg)' }}>
                {mo.productId?.name || 'Custom Garment'}
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                Order #{mo.orderId}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <span className="badge badge--neutral">{mo.status}</span>
            <button className="btn btn--outline btn--sm" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>Track Details <ArrowRight size={13} /></button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderSelector;
