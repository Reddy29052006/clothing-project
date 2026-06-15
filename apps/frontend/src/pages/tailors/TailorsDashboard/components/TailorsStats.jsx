import { Package, Hourglass, Scissors, CheckCircle, Shirt } from 'lucide-react';

const TailorsStats = ({ orders, productsCount }) => {
  const statItems = [
    { label: 'Total Orders', value: orders.length, icon: Package },
    { label: 'Pending Review', value: orders.filter(o => o.tailorsAccepted === null || o.tailorsAccepted === undefined).length, icon: Hourglass },
    { label: 'In Production', value: orders.filter(o => o.tailorsAccepted && o.status !== 'delivered').length, icon: Scissors },
    { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, icon: CheckCircle },
    { label: 'Total Products', value: productsCount, icon: Shirt },
  ];

  return (
    <div className="tailors-stats">
      {statItems.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="tailors-stat card">
            <span><Icon size={24} color="var(--color-primary)" /></span>
            <span className="tailors-stat__value">{s.value}</span>
            <span className="tailors-stat__label">{s.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default TailorsStats;
