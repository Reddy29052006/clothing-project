import { Search } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Landing from '../pages/auth/Landing/Landing';
import Login from '../pages/auth/Login/Login';
import Register from '../pages/auth/Register/Register';
import Onboarding from '../pages/auth/Onboarding';
import { ProtectedOnboardingRoute } from './ProtectedRoute';

// ── Layout Wrappers ────────────────────────────────────────────────────────
export const Layout = ({ children }) => (
  <>
    <Navbar />
    <div style={{ flex: 1 }}>{children}</div>
    <Footer />
  </>
);

export const FullScreen = ({ children }) => children;

// ── Auth & Public Routes ───────────────────────────────────────────────────
const authRoutes = [
  {
    path: '/',
    element: <Layout><Landing /></Layout>,
  },
  {
    path: '/login',
    element: <FullScreen><Login /></FullScreen>,
  },
  {
    path: '/register',
    element: <FullScreen><Register /></FullScreen>,
  },
  {
    path: '/onboarding',
    element: <FullScreen><ProtectedOnboardingRoute><Onboarding /></ProtectedOnboardingRoute></FullScreen>,
  },

  // 404
  {
    path: '*',
    element: (
      <Layout>
        <div className="loading-screen" style={{ position: 'static', minHeight: 'calc(100vh - 72px)' }}>
          <div className="empty-state">
            <div className="empty-state__icon"><Search size={48} color="var(--color-primary)" /></div>
            <h2 className="empty-state__title">Page Not Found</h2>
            <p>The page you're looking for doesn't exist.</p>
            <a href="/" className="btn btn--primary" style={{ marginTop: '1.5rem' }}>Go Home</a>
          </div>
        </div>
      </Layout>
    ),
  },
];

export default authRoutes;
