import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser } from '../store/slices/authSlice';

export const ProtectedRoute = ({ children, roles }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === 'pending_onboarding') return <Navigate to="/onboarding" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />;

  return children;
};

export const ProtectedOnboardingRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'pending_onboarding') {
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;
    if (user?.role === 'tailors') return <Navigate to="/tailors" replace />;
    if (user?.role === 'client') return <Navigate to="/custom-orders" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
