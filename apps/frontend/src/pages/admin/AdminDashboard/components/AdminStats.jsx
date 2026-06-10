import { Package, Scissors, Users, CheckCircle, IndianRupee } from 'lucide-react';

const AdminStats = ({ stats }) => {
  const statItems = [
    { label: 'Total Orders', value: stats.totalOrders, icon: Package, color: 'var(--color-primary)' },
    { label: 'Active Orders', value: stats.pendingOrders, icon: Scissors, color: 'var(--color-warning)' },
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'var(--color-info)' },
    { label: 'Vendors', value: stats.totalVendors, icon: Scissors, color: 'var(--color-gold-muted)' },
    { label: 'Delivered', value: stats.deliveredOrders, icon: CheckCircle, color: 'var(--color-success)' },
    { label: 'Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`, icon: IndianRupee, color: 'var(--color-gold-muted)' },
  ];

  return (
    <div className="admin-stats">
      {statItems.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="admin-stat card">
            <span className="admin-stat__icon">
              <Icon size={24} color={s.color} />
            </span>
            <span className="admin-stat__value" style={{ color: s.color }}>{s.value}</span>
            <span className="admin-stat__label">{s.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default AdminStats;
