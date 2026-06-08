import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { useGetMyOrdersQuery } from '../../../services/ordersApi';
import { useGetMyFeedbackQuery, useSubmitFeedbackMutation } from '../../../services/feedbackApi';
import OrderCard from './components/OrderCard';
import FeedbackModal from './components/FeedbackModal';
import './MyOrders.css';

const MyOrders = () => {
  const [feedbackOrder, setFeedbackOrder] = useState(null);

  const { data: od, isLoading: ordersLoading } = useGetMyOrdersQuery();
  const { data: fd } = useGetMyFeedbackQuery();
  const [submitFeedback, { isLoading: feedbackLoading }] = useSubmitFeedbackMutation();

  const orders = od?.orders || [];
  const submitted = new Set((fd?.feedbacks || []).map((f) => f.orderId?._id || f.orderId));

  const handleFeedbackSubmit = async (orderId, fitRating, comment) => {
    try {
      await submitFeedback({ orderId, fitRating, comment }).unwrap();
      setFeedbackOrder(null);
    } catch { /* errors handled silently */ }
  };

  if (ordersLoading) return <div className="loading-screen"><div className="spinner spinner--lg spinner--gold" /></div>;

  return (
    <div className="my-orders-page container">
      <div className="my-orders-header">
        <h1 className="my-orders-title">My Orders</h1>
        <p className="my-orders-subtitle">View and manage all your purchased items</p>
      </div>

      <div className="my-orders-list">
        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon"><Package size={48} color="var(--color-border)" /></div>
            <h3 className="empty-state__title">No Orders Yet</h3>
            <p>You haven't placed any orders.</p>
            <Link to="/products" className="btn btn--primary" style={{ marginTop: '1rem' }}>Browse Collections</Link>
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard key={order._id} order={order} submitted={submitted} onFeedback={setFeedbackOrder} />
          ))
        )}
      </div>

      {feedbackOrder && (
        <FeedbackModal
          order={feedbackOrder}
          onClose={() => setFeedbackOrder(null)}
          onSubmit={handleFeedbackSubmit}
          isSubmitting={feedbackLoading}
        />
      )}
    </div>
  );
};

export default MyOrders;
