import { useState } from 'react';
import { Shirt, Ruler } from 'lucide-react';
import {
  useGetVendorOrdersQuery,
  useUpdateVendorOrderStatusMutation,
} from '../../../services/vendorApi';
import { useAcceptOrderMutation } from '../../../services/ordersApi';
import '../../user/UserDashboard/UserDashboard.css';
import MeasurementsModal from '../VendorDashboard/components/MeasurementsModal';

const STATUS_OPTIONS = [
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'pattern', label: 'Pattern Created' },
  { value: 'stitching', label: 'Stitching' },
  { value: 'qc', label: 'Quality Check' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
];

const STATUS_BADGE = { pending: 'neutral', confirmed: 'neutral', pattern: 'info', stitching: 'warning', qc: 'warning', shipped: 'info', delivered: 'success' };

const VendorOrders = () => {
  const { data, isLoading, isError } = useGetVendorOrdersQuery();
  const [updateOrderStatus, { isLoading: updating }] = useUpdateVendorOrderStatusMutation();
  const [acceptOrder, { isLoading: accepting }] = useAcceptOrderMutation();
  const [measureModal, setMeasureModal] = useState(null);

  const orders = data?.orders || [];

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
    } catch (err) {
      alert(err?.data?.message || 'Error updating status');
    }
  };

  const handleAccept = async (orderId, accepted) => {
    try {
      await acceptOrder({ id: orderId, accepted }).unwrap();
    } catch {
      alert('Failed to update order.');
    }
  };

  return (
    <div className="dashboard-page container" style={{ padding: '2rem 0' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '2rem' }}>Manage Orders</h1>

      {isLoading ? (
        <div className="spinner spinner--gold" style={{ margin: '3rem auto' }} />
      ) : isError ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--color-error)' }}>Failed to load orders.</div>
      ) : orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>You have no orders yet.</p>
        </div>
      ) : (
        <div className="dashboard-orders">
          {orders.map(order => (
            <div key={order._id} className="order-card card">
              <div className="order-card__image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {order.productId?.primaryImage ? (
                  <img
                    src={`http://localhost:5001${order.productId.primaryImage}`}
                    alt={order.productId?.name || 'Product'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Shirt size={32} color="var(--color-gold-muted)" />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div className="order-card__header">
                  <div>
                    <h3 className="order-card__name">{order.productId?.name}</h3>
                    <p className="order-card__id">Order #{order.orderId}</p>
                  </div>
                  <span className={`badge badge--${STATUS_BADGE[order.status] || 'neutral'}`}>
                    {STATUS_OPTIONS.find(o => o.value === order.status)?.label || (order.status.charAt(0).toUpperCase() + order.status.slice(1))}
                  </span>
                </div>

                <div className="order-card__tags">
                  <span className="badge badge--gold">Fabric: {order.selectedFabric}</span>
                  <span className="badge badge--gold">Color: {order.selectedColor}</span>
                  <span className="badge badge--gold">Fit: {order.fitPreference}</span>
                </div>

                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                  <strong>Customer:</strong> {order.userId?.name} ({order.userId?.email})
                </div>

                <div className="order-card__footer">
                  <div className="order-card__price">&#8377;{order.totalPrice}</div>
                  <div className="order-card__actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button className="btn btn--outline btn--sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      onClick={() => setMeasureModal({ measurements: order.measurements, productName: order.productId?.name })}>
                      <Ruler size={14} /> View Measurements
                    </button>
                    
                    <div style={{ marginLeft: 'auto' }}>
                      {(order.vendorAccepted === null || order.vendorAccepted === undefined) && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn--primary btn--sm" onClick={() => handleAccept(order._id, true)} disabled={accepting}>Accept Order</button>
                          <button className="btn btn--danger  btn--sm" onClick={() => handleAccept(order._id, false)} disabled={accepting}>Reject</button>
                        </div>
                      )}

                      {order.vendorAccepted === true && order.status !== 'delivered' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <label style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>Update Status:</label>
                          <select
                            className="form-input"
                            style={{ padding: '0.25rem 0.5rem', width: 'auto' }}
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            disabled={updating}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {measureModal && (
        <MeasurementsModal
          measurements={measureModal.measurements}
          productName={measureModal.productName}
          onClose={() => setMeasureModal(null)}
        />
      )}
    </div>
  );
};

export default VendorOrders;
