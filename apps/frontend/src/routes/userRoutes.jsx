import ProtectedRoute from './ProtectedRoute';
import { Layout, FullScreen } from './authRoutes';

import Products from '../pages/user/Products/Products';
import ProductCustomization from '../pages/user/ProductCustomization/ProductCustomization';
import MeasurementFlow from '../pages/user/MeasurementFlow/MeasurementFlow';
import Cart from '../pages/user/Cart/Cart';
import OrderTracking from '../pages/user/OrderTracking/OrderTracking';
import UserDashboard from '../pages/user/UserDashboard/UserDashboard';
import MyOrders from '../pages/user/MyOrders/MyOrders';
import PaymentSuccess from '../pages/user/PaymentSuccess/PaymentSuccess';

// ── User / Customer Routes ─────────────────────────────────────────────────
const userRoutes = [
  {
    path: '/products',
    element: (
      <ProtectedRoute>
        <Layout><Products /></Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/products/:id',
    element: (
      <ProtectedRoute>
        <Layout><ProductCustomization /></Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/measure',
    element: (
      <ProtectedRoute roles={['user']}>
        <FullScreen><MeasurementFlow /></FullScreen>
      </ProtectedRoute>
    ),
  },
  {
    path: '/cart',
    element: (
      <ProtectedRoute roles={['user']}>
        <Layout><Cart /></Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/payment-success',
    element: (
      <ProtectedRoute roles={['user']}>
        <Layout><PaymentSuccess /></Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/orders',
    element: (
      <ProtectedRoute roles={['user']}>
        <Layout><MyOrders /></Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/orders/track',
    element: (
      <ProtectedRoute roles={['user']}>
        <Layout><OrderTracking /></Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/orders/:id',
    element: (
      <ProtectedRoute roles={['user']}>
        <Layout><OrderTracking /></Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute roles={['user']}>
        <Layout><UserDashboard /></Layout>
      </ProtectedRoute>
    ),
  },
];

export default userRoutes;
