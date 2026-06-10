import { Package, Hourglass, Scissors, CheckCircle, Shirt } from 'lucide-react';

const VendorStats = ({ orders, productsCount }) => {
  const statItems = [
    { label: 'Total Orders', value: orders.length, icon: Package },
    { label: 'Pending Review', value: orders.filter(o => o.vendorAccepted === null || o.vendorAccepted === undefined).length, icon: Hourglass },
    { label: 'In Production', value: orders.filter(o => o.vendorAccepted && o.status !== 'delivered').length, icon: Scissors },
    { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, icon: CheckCircle },
    { label: 'Total Products', value: productsCount, icon: Shirt },
  ];

  return (
    <div className="vendor-stats">
      {statItems.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="vendor-stat card">
            <span><Icon size={24} color="var(--color-primary)" /></span>
            <span className="vendor-stat__value">{s.value}</span>
            <span className="vendor-stat__label">{s.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default VendorStats;
