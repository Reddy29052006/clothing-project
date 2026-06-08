import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../store/slices/authSlice';
import { useGetMyOrdersQuery } from '../../../services/ordersApi';
import { useGetMyMeasurementQuery } from '../../../services/measurementsApi';
import { useGetMyFeedbackQuery, useSubmitFeedbackMutation } from '../../../services/feedbackApi';
import DashboardStats from './components/DashboardStats';
import OrdersList from './components/OrdersList';
import MeasurementsTab from './components/MeasurementsTab';
import FeedbackModal from './components/FeedbackModal';
import './UserDashboard.css';

const UserDashboard = () => {
  const user = useSelector(selectCurrentUser);
  const [tab, setTab] = useState('orders');
  const [feedbackOrder, setFeedbackOrder] = useState(null);

  const { data: od, isLoading: ordersLoading } = useGetMyOrdersQuery();
  const { data: md } = useGetMyMeasurementQuery();
  const { data: fd } = useGetMyFeedbackQuery();
  const [submitFeedback, { isLoading: feedbackLoading }] = useSubmitFeedbackMutation();

  const orders = od?.orders || [];
  const measurement = md?.measurement;
  const submitted = new Set((fd?.feedbacks || []).map((f) => f.orderId?._id || f.orderId));

  const handleFeedbackSubmit = async (orderId, fitRating, comment) => {
    try {
      await submitFeedback({ orderId, fitRating, comment }).unwrap();
      setFeedbackOrder(null);
    } catch { /* errors handled silently */ }
  };

  if (ordersLoading) return <div className="loading-screen"><div className="spinner spinner--lg spinner--gold" /></div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-hero page-hero">
        <div className="container">
          <div className="dashboard-hero__content">
            <div>
              <h1>Welcome back, {user?.name?.split(' ')[0]}</h1>
              <p>Manage your measurements, orders, and preferences</p>
            </div>
            <Link to="/measure" className="btn btn--gold">Update Measurements</Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <DashboardStats orders={orders} measurement={measurement} />

        <div className="dashboard-tabs">
          {['orders', 'measurements'].map((t) => (
            <button key={t} className={`dashboard-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'orders' && (
          <div className="dashboard-orders">
            <OrdersList orders={orders} submitted={submitted} onFeedback={setFeedbackOrder} />
          </div>
        )}

        {tab === 'measurements' && (
          <div className="dashboard-measurements">
            <MeasurementsTab measurement={measurement} />
          </div>
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

export default UserDashboard;
