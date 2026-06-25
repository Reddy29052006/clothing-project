import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag } from 'lucide-react';
import { selectCartItems, selectCartTotal, clearCart } from '../../../store/slices/cartSlice';
import { selectIsAuthenticated, selectCurrentUser } from '../../../store/slices/authSlice';
import { useCreateCheckoutSessionMutation, useConfirmPaymentMutation } from '../../../services/ordersApi';
import CartItem from './components/CartItem';
import CartSummary from './components/CartSummary';
import './Cart.css';

// Dynamically load Razorpay Checkout script
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (document.querySelector('script[src*="razorpay"]')) {
      return resolve(true);
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotal);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const [createCheckoutSession, { isLoading: checkingOut }] = useCreateCheckoutSessionMutation();
  const [confirmPayment] = useConfirmPaymentMutation();

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
      // Step 1 — Create order on backend
      const result = await createCheckoutSession({
        items: items.map((item) => ({
          productId: item.productId,
          selectedFabric: item.selectedFabric,
          selectedColor: item.selectedColor,
          fitPreference: item.fitPreference,
        })),
        deliveryAddress: address,
      }).unwrap();

      if (!result.success) {
        setOrderError('Failed to initiate checkout.');
        return;
      }

      // Step 2 — MOCK mode: skip Razorpay SDK, go straight to success page
      if (result.mode === 'mock') {
        dispatch(clearCart());
        navigate(`/payment-success?session_id=${result.orderId}`);
        return;
      }

      // Step 3 — Load Razorpay SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setOrderError('Failed to load payment gateway. Please check your internet connection.');
        return;
      }

      // Step 4 — Open Razorpay popup
      const options = {
        key: result.keyId,
        amount: result.amount,       // already in paise from backend
        currency: result.currency,
        name: 'FitCraft',
        description: `Custom Tailoring Order`,
        order_id: result.orderId,    // Razorpay order ID
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: { color: '#6366f1' },
        handler: async (response) => {
          // Step 5 — Verify payment on backend
          try {
            await confirmPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }).unwrap();
            dispatch(clearCart());
            navigate(`/payment-success?session_id=${response.razorpay_order_id}`);
          } catch {
            setOrderError('Payment was made but verification failed. Please contact support with your payment ID: ' + response.razorpay_payment_id);
          }
        },
        modal: {
          ondismiss: () => {
            setOrderError('Payment was cancelled.');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setOrderError(err?.data?.message || 'Failed to initiate checkout. Please try again.');
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
