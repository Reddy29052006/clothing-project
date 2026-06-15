import ProtectedRoute from './ProtectedRoute';
import { Layout } from './authRoutes';
import CustomOrders from '../pages/client/CustomOrders/CustomOrders';

// ── Client / Order-Distributor Routes ─────────────────────────────────────────
const clientRoutes = [
  {
    path: '/custom-orders',
    element: (
      <ProtectedRoute roles={['client']}>
        <Layout><CustomOrders /></Layout>
      </ProtectedRoute>
    ),
  },
];

export default clientRoutes;
