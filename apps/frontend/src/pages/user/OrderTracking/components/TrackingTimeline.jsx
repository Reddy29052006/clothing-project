import { CheckCircle, LayoutTemplate, Scissors, Search, Truck, Gift, Check } from 'lucide-react';

const STATUS_STAGES = [
  { key: 'confirmed', label: 'Order Confirmed', icon: CheckCircle, desc: 'Your order has been received and confirmed.' },
  { key: 'pattern', label: 'Pattern Created', icon: LayoutTemplate, desc: 'Master tailors are drafting your custom pattern.' },
  { key: 'stitching', label: 'Stitching', icon: Scissors, desc: 'Skilled hands are crafting your garment.' },
  { key: 'qc', label: 'Quality Check', icon: Search, desc: 'Final inspection to ensure perfect craftsmanship.' },
  { key: 'shipped', label: 'Shipped', icon: Truck, desc: 'Your garment is on its way to you.' },
  { key: 'delivered', label: 'Delivered', icon: Gift, desc: 'Enjoy your perfectly fitted garment!' },
];

const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', {
  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
}) : '';

const TrackingTimeline = ({ order }) => {
  const currentStageIndex = STATUS_STAGES.findIndex((s) => s.key === order.status);

  return (
    <div className="tracking-timeline card">
      <div className="tracking-order-header">
        <div>
          <h2 className="tracking-order-id">Order #{order.orderId}</h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
            Placed on {fmt(order.createdAt)}
          </p>
        </div>
        <span className={`badge badge--${currentStageIndex >= STATUS_STAGES.length - 1 ? 'success' : currentStageIndex >= 4 ? 'info' : 'warning'}`}>
          {STATUS_STAGES.find(s => s.key === order.status)?.label || order.status}
        </span>
      </div>

      <div className="timeline">
        {STATUS_STAGES.map((stage, i) => {
          const isDone = i < currentStageIndex;
          const isCurrent = i === currentStageIndex;
          const histEntry = order.statusHistory?.find(h => h.status === stage.key);
          const Icon = stage.icon;
          return (
            <div key={stage.key} className={`timeline-item ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
              <div className="timeline-item__marker">
                <div className="timeline-item__dot">
                  {isDone ? <Check size={14} /> : <Icon size={16} style={{ opacity: isCurrent ? 1 : 0.4 }} />}
                </div>
                {i < STATUS_STAGES.length - 1 && (
                  <div className={`timeline-item__line ${isDone || isCurrent ? 'filled' : ''}`} />
                )}
              </div>
              <div className="timeline-item__content">
                <h4 className="timeline-item__title">{stage.label}</h4>
                <p className="timeline-item__desc">{isCurrent ? stage.desc : histEntry ? stage.desc : 'Pending'}</p>
                {histEntry && <span className="timeline-item__time">{fmt(histEntry.timestamp)}</span>}
                {histEntry?.note && <span className="timeline-item__note">{histEntry.note}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {order.estimatedDelivery && order.status !== 'delivered' && (
        <div className="tracking-eta">
          <Truck size={18} color="var(--color-gold-muted)" />
          <div>
            <p className="tracking-eta__label">Estimated Delivery</p>
            <p className="tracking-eta__date">{fmt(order.estimatedDelivery)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export { STATUS_STAGES };
export default TrackingTimeline;
