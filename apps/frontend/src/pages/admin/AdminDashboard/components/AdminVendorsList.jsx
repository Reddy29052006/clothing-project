import { Star, CheckCircle } from 'lucide-react';

const AdminVendorsList = ({ vendors, handleVerify }) => {
  return (
    <div className="admin-vendors">
      {vendors.map((vendor) => (
        <div key={vendor._id} className="admin-vendor-card card">
          <div className="admin-vendor-card__left">
            <div className="admin-vendor-card__avatar">{vendor.userId?.name?.[0] || 'V'}</div>
            <div>
              <h3 className="admin-vendor-card__name">{vendor.shopName}</h3>
              <p className="admin-vendor-card__email">{vendor.userId?.name} · {vendor.userId?.email}</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                {vendor.specializations?.map(s => <span key={s} className="badge badge--neutral">{s}</span>)}
              </div>
            </div>
          </div>
          <div className="admin-vendor-card__stats">
            <div className="admin-vendor-stat">
              <Star size={16} color="var(--color-gold)" style={{ marginRight: '4px' }} />
              <strong>{vendor.rating?.toFixed(1)}</strong>
              <span>Rating</span>
            </div>
            <div className="admin-vendor-stat">
              <CheckCircle size={16} color="var(--color-success)" style={{ marginRight: '4px' }} />
              <strong>{vendor.totalCompleted}</strong>
              <span>Completed</span>
            </div>
          </div>
          <div className="admin-vendor-card__actions">
            <span className={`badge badge--${vendor.isVerified ? 'success' : 'neutral'}`}>{vendor.isVerified ? '✓ Verified' : 'Unverified'}</span>
            <button className={`btn btn--sm ${vendor.isVerified ? 'btn--danger' : 'btn--primary'}`}
              onClick={() => handleVerify(vendor._id, !vendor.isVerified)}>
              {vendor.isVerified ? 'Revoke' : 'Verify'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminVendorsList;
