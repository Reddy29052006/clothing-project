import { Package, Scissors, CheckCircle, Ruler } from 'lucide-react';

const DashboardStats = ({ orders, measurement }) => {
  const stats = [
    { label: 'Total Orders', value: orders.length, icon: Package },
    { label: 'In Production', value: orders.filter(o => o.status !== 'delivered').length, icon: Scissors },
    { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, icon: CheckCircle },
    { label: 'Measurements', value: measurement ? 'Saved' : 'None', icon: Ruler },
  ];

  return (
    <div className="dashboard-stats">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="dashboard-stat-card card">
            <span className="dashboard-stat-card__icon"><Icon size={24} color="var(--color-gold-muted)" /></span>
            <span className="dashboard-stat-card__value">{s.value}</span>
            <span className="dashboard-stat-card__label">{s.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
