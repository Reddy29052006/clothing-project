import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useGetOrderByIdQuery, useGetMyOrdersQuery } from '../../../services/ordersApi';
import TrackingTimeline from './components/TrackingTimeline';
import OrderSelector from './components/OrderSelector';
import TrackingDetails from './components/TrackingDetails';
import './OrderTracking.css';

const OrderTracking = () => {
  const { id } = useParams();
  const [queryId, setQueryId] = useState(id || '');

  const { data, isLoading, isError } = useGetOrderByIdQuery(queryId, { skip: !queryId });
  const { data: od, isLoading: myOrdersLoading } = useGetMyOrdersQuery(undefined, { skip: !!queryId });

  const order = data?.order;
  const myOrders = od?.orders || [];

  return (
    <div className="tracking-page">
      <div className="page-hero">
        <div className="container">
          <h1>Order Tracking</h1>
          <p>Follow your garment from pattern to delivery</p>
        </div>
      </div>

      <div className="tracking-content container">
        {!queryId && (
          <div className="tracking-selection">
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', color: 'var(--color-primary)', marginBottom: 'var(--space-6)' }}>
              Select an Order to Track
            </h3>
            <OrderSelector myOrders={myOrders} myOrdersLoading={myOrdersLoading} onSelect={setQueryId} />
          </div>
        )}

        {isLoading && (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div className="spinner spinner--lg spinner--gold" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--color-text-muted)' }}>Loading order…</p>
          </div>
        )}

        {(isError || (queryId && !isLoading && !order)) && (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-error)' }}>
              <AlertTriangle size={18} /> Order not found
            </div>
            <Link to="/dashboard" className="btn btn--outline btn--sm">View My Orders</Link>
          </div>
        )}

        {order && !isLoading && (
          <div className="tracking-layout">
            <TrackingTimeline order={order} />
            <TrackingDetails order={order} />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
