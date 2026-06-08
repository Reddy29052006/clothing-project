import ProtectedRoute from './ProtectedRoute';
import VendorLayout from '../pages/vendor/VendorLayout/VendorLayout';
import VendorDashboard from '../pages/vendor/VendorDashboard/VendorDashboard';
import VendorOrders from '../pages/vendor/VendorOrders/VendorOrders';
import VendorCollection from '../pages/vendor/VendorCollection/VendorCollection';
import AddProduct from '../pages/vendor/AddProduct/AddProduct';
import EditProduct from '../pages/vendor/EditProduct/EditProduct';
import VendorProductDetail from '../pages/vendor/VendorProductDetail/VendorProductDetail';

// ── Vendor Routes ──────────────────────────────────────────────────────────
const vendorRoutes = [
  {
    path: '/vendor',
    element: (
      <ProtectedRoute roles={['vendor']}>
        <VendorLayout><VendorDashboard /></VendorLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/vendor/orders',
    element: (
      <ProtectedRoute roles={['vendor']}>
        <VendorLayout><VendorOrders /></VendorLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/vendor/products',
    element: (
      <ProtectedRoute roles={['vendor']}>
        <VendorLayout><VendorCollection /></VendorLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/vendor/products/add',
    element: (
      <ProtectedRoute roles={['vendor']}>
        <VendorLayout><AddProduct /></VendorLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/vendor/products/edit/:id',
    element: (
      <ProtectedRoute roles={['vendor']}>
        <VendorLayout><EditProduct /></VendorLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/vendor/products/detail/:id',
    element: (
      <ProtectedRoute roles={['vendor']}>
        <VendorLayout><VendorProductDetail /></VendorLayout>
      </ProtectedRoute>
    ),
  },
];

export default vendorRoutes;
