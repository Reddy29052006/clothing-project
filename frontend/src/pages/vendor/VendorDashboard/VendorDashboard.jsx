import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../store/slices/authSlice';
import {
  useAcceptOrderMutation,
} from '../../../services/ordersApi';
import {
  useGetVendorProductsQuery,
  useGetVendorOrdersQuery,
  useUpdateVendorOrderStatusMutation,
} from '../../../services/vendorApi';
import { Scissors, Ruler } from 'lucide-react';
import VendorStats from './components/VendorStats';
import MeasurementsModal from './components/MeasurementsModal';
import './VendorDashboard.css';

const STATUS_OPTIONS = [
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'pattern', label: 'Pattern Created' },
  { value: 'stitching', label: 'Stitching' },
  { value: 'qc', label: 'Quality Check' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
];

const STATUS_BADGE = { confirmed: 'neutral', pattern: 'info', stitching: 'warning', qc: 'warning', shipped: 'info', delivered: 'success' };

const VendorDashboard = () => {
  const user = useSelector(selectCurrentUser);
  const [activeTab, setActiveTab] = useState('pending');
  const [measureModal, setMeasureModal] = useState(null);

  const { data, isLoading, refetch } = useGetVendorOrdersQuery();
  const { data: pd } = useGetVendorProductsQuery();
  const [acceptOrder, { isLoading: accepting }] = useAcceptOrderMutation();
  const [updateStatus, { isLoading: updating }] = useUpdateVendorOrderStatusMutation();

  const orders = data?.orders || [];
  const productsCount = pd?.products?.length || 0;

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'pending') return o.vendorAccepted === null || o.vendorAccepted === undefined;
    if (activeTab === 'active') return o.vendorAccepted === true && o.status !== 'delivered';
    if (activeTab === 'done') return o.status === 'delivered';
    return true;
  });


  const handleAccept = async (orderId, accepted) => {
    try { await acceptOrder({ id: orderId, accepted }).unwrap(); } catch { alert('Failed to update order.'); }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try { await updateStatus({ id: orderId, status }).unwrap(); } catch { alert('Failed to update status.'); }
  };

  if (isLoading) return <div className="loading-screen"><div className="spinner spinner--lg spinner--gold" /></div>;

  return (
    <div className="vendor-page">
      <div className="page-hero">
        <div className="container">
          <h1>Vendor Dashboard</h1>
          <p>Welcome back, {user?.name} · Manage your production orders</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <VendorStats orders={orders} productsCount={productsCount} />

        {/* Tabs */}
        <div className="dashboard-tabs">
          {[{ key: 'pending', label: 'New Requests' }, { key: 'active', label: 'In Production' }, { key: 'done', label: 'Completed' }].map((t) => (
            <button key={t.key} className={`dashboard-tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Orders */}
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon"><Scissors size={48} color="var(--color-border)" /></div>
            <h3 className="empty-state__title">No orders here</h3>
            <p>Check back soon for new assignments.</p>
          </div>
        ) : (
          <div className="vendor-orders">
            {filteredOrders.map((order) => (
              <div key={order._id} className="vendor-order card">
                <div className="vendor-order__header">
                  <div>
                    <h3 className="vendor-order__id">Order #{order.orderId}</h3>
                    <p className="vendor-order__product">{order.productId?.name || 'Custom Garment'}</p>
                    <p className="vendor-order__customer">Customer: {order.userId?.name} · {order.userId?.email}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <span className={`badge badge--${STATUS_BADGE[order.status] || 'neutral'}`}>
                      {STATUS_OPTIONS.find(s => s.value === order.status)?.label || order.status}
                    </span>
                    {order.vendorAccepted === false && <span className="badge badge--error">Rejected</span>}
                    {(order.vendorAccepted === null || order.vendorAccepted === undefined) && <span className="badge badge--warning">Pending Review</span>}
                  </div>
                </div>

                <div className="vendor-order__customizations">
                  <span className="badge badge--neutral">{order.selectedFabric}</span>
                  <span className="badge badge--neutral">{order.selectedColor}</span>
                  <span className="badge badge--neutral">{order.fitPreference} fit</span>
                </div>

                <div className="vendor-order__footer">
                  <button className="btn btn--outline btn--sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    onClick={() => setMeasureModal({ measurements: order.measurements, productName: order.productId?.name })}>
                    <Ruler size={14} /> View Measurements
                  </button>

                  {(order.vendorAccepted === null || order.vendorAccepted === undefined) && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn--primary btn--sm" onClick={() => handleAccept(order._id, true)} disabled={accepting}>Accept Order</button>
                      <button className="btn btn--danger  btn--sm" onClick={() => handleAccept(order._id, false)} disabled={accepting}>Reject</button>
                    </div>
                  )}

                  {order.vendorAccepted === true && order.status !== 'delivered' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <label className="form-label" style={{ margin: 0, fontSize: 'var(--text-xs)' }}>Update Stage:</label>
                      <select className="form-select" style={{ maxWidth: 200 }} value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)} disabled={updating}>
                        {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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

export default VendorDashboard;
