import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Shirt, Check } from 'lucide-react';
import { removeItem } from '../../../../store/slices/cartSlice';

const CartItem = ({ item, index }) => {
  const dispatch = useDispatch();
  const productUrl = item.productId ? `/products/${item.productId}` : '#';

  return (
    <div className="cart-item card">

      {/* Product image — click to view full product details */}
      <Link to={productUrl} className="cart-item__image">
        {item.primaryImage ? (
          <img
            src={`http://localhost:5001${item.primaryImage}`}
            alt={item.productName}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            <Shirt size={32} color="var(--color-gold-muted)" />
          </div>
        )}
      </Link>

      <div className="cart-item__details">
        <Link to={productUrl} className="cart-item__name" style={{ textDecoration: 'none' }}>
          {item.productName}
        </Link>
        <div className="cart-item__tags">
          <span className="badge badge--neutral">{item.selectedFabric}</span>
          <span className="badge badge--neutral" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: item.selectedColorHex, display: 'inline-block', border: '1px solid rgba(0,0,0,0.1)' }} />
            {item.selectedColor}
          </span>
          <span className="badge badge--neutral">{item.fitPreference} fit</span>
        </div>
        {item.measurements && (
          <div className="cart-item__measurements">
            <span className="badge badge--success" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Check size={12} /> Custom measurements applied
            </span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              Ch: {item.measurements.chest}cm &middot; W: {item.measurements.waist}cm &middot; Sh: {item.measurements.shoulder}cm
            </span>
          </div>
        )}
      </div>

      <div className="cart-item__right">
        <span className="cart-item__price">&#8377;{item.totalPrice?.toLocaleString('en-IN')}</span>
        {item.fabricSurcharge > 0 && (
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Base &#8377;{item.basePrice?.toLocaleString('en-IN')} + &#8377;{item.fabricSurcharge}
          </span>
        )}
        <button className="btn btn--danger btn--sm" onClick={() => dispatch(removeItem(index))}>Remove</button>
      </div>
    </div>
  );
};

export default CartItem;
