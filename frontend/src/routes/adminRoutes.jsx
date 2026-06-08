import ProtectedRoute from './ProtectedRoute';
import { Layout } from './authRoutes';
import AdminDashboard from '../pages/admin/AdminDashboard/AdminDashboard';

// ── Admin Routes ───────────────────────────────────────────────────────────
const adminRoutes = [
  {
    path: '/admin',
    element: (
      <ProtectedRoute roles={['admin']}>
        <Layout><AdminDashboard /></Layout>
      </ProtectedRoute>
    ),
  },
];

export default adminRoutes;
