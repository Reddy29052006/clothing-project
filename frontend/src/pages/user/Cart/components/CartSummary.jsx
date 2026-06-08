import { Truck, AlertTriangle } from 'lucide-react';

const CartSummary = ({ items, totalPrice, address, setAddress, errors, setErrors, orderError, checkingOut, onCheckout }) => (
  <div className="cart-summary">
    <div className="card">
      <h3 className="cart-summary__title">Order Summary</h3>
      <div className="cart-summary__lines">
        {items.map((item, i) => (
          <div key={i} className="cart-summary__line">
            <span>{item.productName}</span>
            <span>₹{item.totalPrice?.toLocaleString('en-IN')}</span>
          </div>
        ))}
      </div>
      <div className="divider" />
      <div className="cart-summary__line cart-summary__line--total">
        <span>Total</span>
        <span>₹{totalPrice.toLocaleString('en-IN')}</span>
      </div>
      <div className="cart-summary__note">
        <Truck size={16} color="var(--color-gold-muted)" />
        <span>Free delivery · Estimated 10 business days</span>
      </div>
      <div className="divider" />

      <h4 className="cart-section-label">Delivery Address</h4>
      <div className="cart-address-form">
        <div className="form-group">
          <label className="form-label">Street Address</label>
          <input className={`form-input ${errors.street ? 'error' : ''}`} placeholder="12 MG Road, Apt 4B"
            value={address.street} onChange={(e) => { setAddress({ ...address, street: e.target.value }); setErrors({}); }} />
          {errors.street && <p className="form-error">{errors.street}</p>}
        </div>
        <div className="cart-address-row">
          <div className="form-group">
            <label className="form-label">City</label>
            <input className={`form-input ${errors.city ? 'error' : ''}`} placeholder="Hyderabad"
              value={address.city} onChange={(e) => { setAddress({ ...address, city: e.target.value }); setErrors({}); }} />
            {errors.city && <p className="form-error">{errors.city}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">State</label>
            <input className={`form-input ${errors.state ? 'error' : ''}`} placeholder="Telangana"
              value={address.state} onChange={(e) => { setAddress({ ...address, state: e.target.value }); setErrors({}); }} />
            {errors.state && <p className="form-error">{errors.state}</p>}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Pincode</label>
          <input className={`form-input ${errors.pincode ? 'error' : ''}`} placeholder="500001" maxLength={6}
            value={address.pincode} onChange={(e) => { setAddress({ ...address, pincode: e.target.value }); setErrors({}); }} />
          {errors.pincode && <p className="form-error">{errors.pincode}</p>}
        </div>
      </div>

      {orderError && (
        <div className="auth-error" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} role="alert">
          <AlertTriangle size={16} /> {orderError}
        </div>
      )}

      <button className="btn btn--primary btn--lg" style={{ width: '100%', justifyContent: 'center' }}
        onClick={onCheckout} disabled={checkingOut}>
      {checkingOut ? <><span className="spinner" />Placing Order&hellip;</> : 'Place Order'}
      </button>
    </div>
  </div>
);

export default CartSummary;
