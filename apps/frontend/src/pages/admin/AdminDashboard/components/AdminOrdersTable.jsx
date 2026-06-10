import { useState } from 'react';

const STATUS_COLORS = {
  confirmed: 'neutral', pattern: 'info', stitching: 'warning', qc: 'warning', shipped: 'info', delivered: 'success',
};
const STATUS_LABEL = {
  confirmed: 'Confirmed', pattern: 'Pattern', stitching: 'Stitching', qc: 'Quality Check', shipped: 'Shipped', delivered: 'Delivered',
};

const AdminOrdersTable = ({ orders, filterStatus, setFilterStatus }) => {
  return (
    <>
      <div className="admin-filters">
        <label className="form-label" style={{ margin: 0 }}>Filter by status:</label>
        <select className="form-select" style={{ maxWidth: 220 }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Orders</option>
          {Object.entries(STATUS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Showing {orders.length} orders</span>
      </div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr><th>Order ID</th><th>Customer</th><th>Product</th><th>Status</th><th>Vendor</th><th>Amount</th></tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{order.orderId}</span></td>
                <td>
                  <div>
                    <p style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{order.userId?.name}</p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{order.userId?.email}</p>
                  </div>
                </td>
                <td style={{ fontSize: 'var(--text-sm)' }}>{order.productId?.name || '—'}</td>
                <td><span className={`badge badge--${STATUS_COLORS[order.status] || 'neutral'}`}>{STATUS_LABEL[order.status] || order.status}</span></td>
                <td style={{ fontSize: 'var(--text-sm)' }}>{order.vendorId?.name || <span style={{ color: 'var(--color-text-light)' }}>Unassigned</span>}</td>
                <td style={{ fontWeight: 500 }}>₹{order.totalPrice?.toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminOrdersTable;
