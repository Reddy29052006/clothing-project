import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag } from 'lucide-react';
import { selectCartItems, selectCartTotal, clearCart } from '../../../store/slices/cartSlice';
import { selectIsAuthenticated } from '../../../store/slices/authSlice';
import { useCreateOrderMutation } from '../../../services/ordersApi';
import CartItem from './components/CartItem';
import CartSummary from './components/CartSummary';
import './Cart.css';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotal);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [createOrder, { isLoading: checkingOut }] = useCreateOrderMutation();

  const [address, setAddress] = useState({ street: '', city: '', state: '', pincode: '' });
  const [errors, setErrors] = useState({});
  const [orderError, setOrderError] = useState('');

  const validateAddress = () => {
    const errs = {};
    if (!address.street.trim()) errs.street = 'Street address required';
    if (!address.city.trim()) errs.city = 'City required';
    if (!address.state.trim()) errs.state = 'State required';
    if (!address.pincode.trim() || !/^\d{6}$/.test(address.pincode)) errs.pincode = 'Valid 6-digit pincode required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!validateAddress()) return;
    setOrderError('');
    try {
      const results = await Promise.all(
        items.map((item) =>
          createOrder({
            productId: item.productId,
            selectedFabric: item.selectedFabric,
            selectedColor: item.selectedColor,
            fitPreference: item.fitPreference,
            deliveryAddress: address,
          }).unwrap()
        )
      );
      dispatch(clearCart());
      const firstId = results[0]?.order?._id;
      navigate(firstId ? `/orders/${firstId}` : '/dashboard');
    } catch (err) {
      setOrderError(err?.data?.message || 'Failed to place order. Please try again.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-state" style={{ paddingTop: 'calc(var(--nav-height) + 4rem)' }}>
            <div className="empty-state__icon"><ShoppingBag size={48} color="var(--color-border)" /></div>
            <h2 className="empty-state__title">Your Cart is Empty</h2>
            <p>Browse our collections to find your perfect garment.</p>
            <Link to="/products" className="btn btn--primary" style={{ marginTop: '1.5rem' }}>Browse Collections</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="page-hero">
        <div className="container">
          <h1>Your Cart</h1>
          <p>{items.length} item{items.length !== 1 ? 's' : ''} ready for crafting</p>
        </div>
      </div>

      <div className="cart-grid container">
        <div className="cart-items">
          {items.map((item, i) => <CartItem key={i} item={item} index={i} />)}
        </div>
        <CartSummary
          items={items}
          totalPrice={totalPrice}
          address={address}
          setAddress={setAddress}
          errors={errors}
          setErrors={setErrors}
          orderError={orderError}
          checkingOut={checkingOut}
          onCheckout={handleCheckout}
        />
      </div>
    </div>
  );
};

export default Cart;
