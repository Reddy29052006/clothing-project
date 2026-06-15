import { Star, CheckCircle } from 'lucide-react';

const AdminTailorsList = ({ tailors, handleVerify }) => {
  return (
    <div className="admin-tailors">
      {tailors.map((tailors) => (
        <div key={tailors._id} className="admin-tailors-card card">
          <div className="admin-tailors-card__left">
            <div className="admin-tailors-card__avatar">{tailors.userId?.name?.[0] || 'V'}</div>
            <div>
              <h3 className="admin-tailors-card__name">{tailors.shopName}</h3>
              <p className="admin-tailors-card__email">{tailors.userId?.name} · {tailors.userId?.email}</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                {tailors.specializations?.map(s => <span key={s} className="badge badge--neutral">{s}</span>)}
              </div>
            </div>
          </div>
          <div className="admin-tailors-card__stats">
            <div className="admin-tailors-stat">
              <Star size={16} color="var(--color-gold)" style={{ marginRight: '4px' }} />
              <strong>{tailors.rating?.toFixed(1)}</strong>
              <span>Rating</span>
            </div>
            <div className="admin-tailors-stat">
              <CheckCircle size={16} color="var(--color-success)" style={{ marginRight: '4px' }} />
              <strong>{tailors.totalCompleted}</strong>
              <span>Completed</span>
            </div>
          </div>
          <div className="admin-tailors-card__actions">
            <span className={`badge badge--${tailors.isVerified ? 'success' : 'neutral'}`}>{tailors.isVerified ? '✓ Verified' : 'Unverified'}</span>
            <button className={`btn btn--sm ${tailors.isVerified ? 'btn--danger' : 'btn--primary'}`}
              onClick={() => handleVerify(tailors._id, !tailors.isVerified)}>
              {tailors.isVerified ? 'Revoke' : 'Verify'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminTailorsList;
