import ProtectedRoute from './ProtectedRoute';
import TailorsLayout from '../pages/tailors/TailorsLayout/TailorsLayout';
import TailorsDashboard from '../pages/tailors/TailorsDashboard/TailorsDashboard';
import TailorsOrders from '../pages/tailors/TailorsOrders/TailorsOrders';
import TailorsCollection from '../pages/tailors/TailorsCollection/TailorsCollection';
import AddProduct from '../pages/tailors/AddProduct/AddProduct';
import EditProduct from '../pages/tailors/EditProduct/EditProduct';
import TailorsProductDetail from '../pages/tailors/TailorsProductDetail/TailorsProductDetail';
import TailorOrders from '../pages/tailors/TailorOrders/TailorOrders';
import OpenOrders from '../pages/tailors/OpenOrders/OpenOrders';

// ── Tailors Routes ──────────────────────────────────────────────────────────
const tailorsRoutes = [
  {
    path: '/tailors',
    element: (
      <ProtectedRoute roles={['tailors']}>
        <TailorsLayout><TailorsDashboard /></TailorsLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/tailors/tailoring',
    element: (
      <ProtectedRoute roles={['tailors']}>
        <TailorsLayout><TailorOrders /></TailorsLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/tailors/open-orders',
    element: (
      <ProtectedRoute roles={['tailors']}>
        <TailorsLayout><OpenOrders /></TailorsLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/tailors/orders',
    element: (
      <ProtectedRoute roles={['tailors']}>
        <TailorsLayout><TailorsOrders /></TailorsLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/tailors/products',
    element: (
      <ProtectedRoute roles={['tailors']}>
        <TailorsLayout><TailorsCollection /></TailorsLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/tailors/products/add',
    element: (
      <ProtectedRoute roles={['tailors']}>
        <TailorsLayout><AddProduct /></TailorsLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/tailors/products/edit/:id',
    element: (
      <ProtectedRoute roles={['tailors']}>
        <TailorsLayout><EditProduct /></TailorsLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/tailors/products/detail/:id',
    element: (
      <ProtectedRoute roles={['tailors']}>
        <TailorsLayout><TailorsProductDetail /></TailorsLayout>
      </ProtectedRoute>
    ),
  },
];

export default tailorsRoutes;
