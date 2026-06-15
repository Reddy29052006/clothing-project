import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../store/slices/authSlice';
import {
  useGetAdminStatsQuery,
  useGetAdminOrdersQuery,
  useGetAdminTailorsQuery,
  useVerifyTailorsMutation,
} from '../../../services/adminApi';
import AdminStats from './components/AdminStats';
import AdminOrdersTable from './components/AdminOrdersTable';
import AdminTailorsList from './components/AdminTailorsList';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const user = useSelector(selectCurrentUser);
  const [activeTab, setActiveTab] = useState('orders');
  const [filterStatus, setFilterStatus] = useState('');

  const { data: sd, isLoading: statsLoading } = useGetAdminStatsQuery();
  const { data: od, isLoading: ordersLoading } = useGetAdminOrdersQuery(filterStatus ? { status: filterStatus } : undefined);
  const { data: vd, isLoading: tailorsLoading } = useGetAdminTailorsQuery();
  const [verifyTailors] = useVerifyTailorsMutation();

  const stats = sd?.stats || {};
  const orders = od?.orders || [];
  const tailors = vd?.tailors || [];

  const handleVerify = async (tailorsId, isVerified) => {
    try { await verifyTailors({ tailorsId, isVerified }).unwrap(); }
    catch { alert('Failed to update tailors.'); }
  };

  const loading = statsLoading || ordersLoading || tailorsLoading;

  if (loading) return <div className="loading-screen"><div className="spinner spinner--lg spinner--gold" /></div>;

  return (
    <div className="admin-page">
      <div className="page-hero">
        <div className="container">
          <h1>Admin Dashboard</h1>
          <p>Platform overview · {user?.name}</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <AdminStats stats={stats} />

        {/* Tabs */}
        <div className="dashboard-tabs">
          {['orders', 'tailors'].map((t) => (
            <button key={t} className={`dashboard-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'orders' && (
          <AdminOrdersTable orders={orders} filterStatus={filterStatus} setFilterStatus={setFilterStatus} />
        )}

        {activeTab === 'tailors' && (
          <AdminTailorsList tailors={tailors} handleVerify={handleVerify} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
