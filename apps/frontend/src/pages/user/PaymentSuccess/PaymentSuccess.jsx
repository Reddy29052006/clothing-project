import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useConfirmPaymentMutation } from '../../../services/ordersApi';
import { CheckCircle2, XCircle, Loader2, ArrowRight, ShoppingBag } from 'lucide-react';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const navigate = useNavigate();

  const [confirmPayment, { data, isLoading, error }] = useConfirmPaymentMutation();

  useEffect(() => {
    if (sessionId) {
      confirmPayment({ sessionId });
    }
  }, [sessionId, confirmPayment]);

  if (!sessionId) {
    return (
      <div className="payment-result-container">
        <div className="result-card error-card">
          <XCircle size={56} className="error-icon" />
          <h2>Invalid Session</h2>
          <p>No payment session ID was found. Please check your order history to verify status.</p>
          <button className="btn btn--primary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="payment-result-container">
        <div className="result-card loading-card">
          <Loader2 size={56} className="loading-spinner" />
          <h2>Verifying Payment</h2>
          <p>We are verifying your transaction with the payment gateway. Please do not close or refresh this page.</p>
        </div>
      </div>
    );
  }

  if (error || (data && !data.success)) {
    return (
      <div className="payment-result-container">
        <div className="result-card error-card">
          <XCircle size={56} className="error-icon" />
          <h2>Payment Verification Failed</h2>
          <p>{error?.data?.message || 'Could not verify payment. Please contact support.'}</p>
          <button className="btn btn--primary" onClick={() => navigate('/cart')}>
            Return to Cart
          </button>
        </div>
      </div>
    );
  }

  const orders = data?.orders || [];

  return (
    <div className="payment-result-container">
      <div className="result-card success-card animate-scaleUp">
        <div className="success-icon-wrapper">
          <CheckCircle2 size={64} className="success-icon" />
        </div>
        
        <h1 className="success-title">Payment Confirmed!</h1>
        <p className="success-subtitle">
          Your payment was successful and your order has been sent to our master tailors.
        </p>

        {orders.length > 0 && (
          <div className="payment-orders-list">
            <h3>Created Orders</h3>
            {orders.map((order) => (
              <div key={order._id} className="payment-order-item">
                <div className="order-item-left">
                  <ShoppingBag size={18} className="order-bag-icon" />
                  <div>
                    <span className="order-item-id">{order.orderId}</span>
                    <span className="order-item-fabric">Fabric: {order.selectedFabric}</span>
                  </div>
                </div>
                <span className="order-item-price">${order.totalPrice}</span>
              </div>
            ))}
          </div>
        )}

        <div className="result-actions">
          <button className="btn btn--primary" onClick={() => navigate('/orders')}>
            Track Your Orders <ArrowRight size={16} style={{ marginLeft: '8px' }} />
          </button>
          <button className="btn btn--secondary" onClick={() => navigate('/products')}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
