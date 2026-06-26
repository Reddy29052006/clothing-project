import { useRef, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectIsAdmin,
  selectIsTailors,
  selectIsUser,
  selectIsClient,
  logout,
} from '../../store/slices/authSlice';

import { selectCartCount } from '../../store/slices/cartSlice';
import './Navbar.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  const isTailors = useSelector(selectIsTailors);
  const isUser = useSelector(selectIsUser);
  const isClient = useSelector(selectIsClient);
  const itemCount = useSelector(selectCartCount);

  const isPendingOnboarding = user?.role === 'pending_onboarding';

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const getDashboardLink = () => {
    if (isAdmin) return '/admin';
    if (isTailors) return '/tailors';
    if (isClient) return '/custom-orders';
    return '/dashboard';
  };

  return (
    <header className="navbar navbar--scrolled">
      <div className="navbar__inner container">

        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">✦</span>
          <span className="navbar__logo-text">FitCraft</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar__nav" aria-label="Main Navigation">
          {isAuthenticated && isPendingOnboarding ? (
            <span className="navbar__link active" style={{ letterSpacing: '0.05em', color: 'var(--color-gold)' }}>Complete Account Setup ✦</span>
          ) : (
            <>
              {!isClient && (
                <>
                  <Link to="/products" className={`navbar__link ${isActive('/products') ? 'active' : ''}`}>Collections</Link>
                  <Link to="/measure" className={`navbar__link ${isActive('/measure') ? 'active' : ''}`}>Get Measured</Link>
                </>
              )}
              {isAuthenticated && isClient && (
                <Link to="/custom-orders" className={`navbar__link ${isActive('/custom-orders') ? 'active' : ''}`}>Custom Tailoring</Link>
              )}
              {isAuthenticated && isTailors && (
                <Link to="/tailors/tailoring" className={`navbar__link ${isActive('/tailors/tailoring') ? 'active' : ''}`}>Tailoring Jobs</Link>
              )}
              {isAuthenticated && isUser && (
                <Link to="/orders" className={`navbar__link ${isActive('/orders') ? 'active' : ''}`}>My Orders</Link>
              )}
            </>
          )}
        </nav>

        {/* Actions */}
        <div className="navbar__actions">
          {isAuthenticated ? (
            <>
              {/* Cart — only for user role */}
              {isUser && !isPendingOnboarding && (
                <Link to="/cart" className="navbar__cart-btn" aria-label="Cart">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                  {itemCount > 0 && <span className="navbar__badge">{itemCount}</span>}
                </Link>
              )}

              {/* User avatar dropdown */}
              <div className="navbar__user" ref={dropdownRef}>
                <button
                  className="navbar__avatar"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                  aria-label="User menu"
                >
                  <span>{user?.name?.[0]?.toUpperCase() || 'U'}</span>
                </button>

                {dropdownOpen && (
                  <div className="navbar__dropdown animate-fadeDown">
                    <div className="navbar__dropdown-header">
                      <p className="navbar__dropdown-name">{user?.name}</p>
                      <p className="navbar__dropdown-email">{user?.email}</p>
                      <span className={`badge badge--${user?.role === 'admin' ? 'primary' : user?.role === 'tailors' ? 'gold' : user?.role === 'client' ? 'purple' : user?.role === 'pending_onboarding' ? 'error' : 'success'}`}>
                        {user?.role === 'pending_onboarding' ? 'setup pending' : user?.role}
                      </span>
                    </div>
                    <div className="divider" style={{ margin: '0.5rem 0' }} />
                    {!isPendingOnboarding ? (
                      <>
                        <Link to={getDashboardLink()} className="navbar__dropdown-item">Dashboard</Link>
                        {isClient && (
                          <Link to="/custom-orders" className="navbar__dropdown-item">Custom Tailoring</Link>
                        )}
                        {isUser && (
                          <Link to="/orders" className="navbar__dropdown-item">My Orders</Link>
                        )}
                        {isTailors && (
                          <Link to="/tailors/tailoring" className="navbar__dropdown-item">Tailoring Jobs</Link>
                        )}
                      </>
                    ) : (
                      <Link to="/onboarding" className="navbar__dropdown-item">Complete Setup</Link>
                    )}
                    <button onClick={handleLogout} className="navbar__dropdown-item navbar__dropdown-item--danger">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn--ghost btn--sm">Login</Link>
              <Link to="/register" className="btn btn--primary btn--sm">Get Started</Link>
            </>
          )}

          {/* Hamburger */}
          <button
            className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="navbar__mobile animate-fadeDown">
          <nav className="navbar__mobile-nav">
            {isAuthenticated && isPendingOnboarding ? (
              <>
                <span className="navbar__mobile-link" style={{ color: 'var(--color-gold)' }}>Complete Account Setup ✦</span>
                <button onClick={handleLogout} className="navbar__mobile-link navbar__mobile-link--danger">Sign Out</button>
              </>
            ) : (
              <>
                {!isClient && (
                  <>
                    <Link to="/products" className="navbar__mobile-link">Collections</Link>
                    <Link to="/measure" className="navbar__mobile-link">Get Measured</Link>
                  </>
                )}
                {isAuthenticated && (
                  <>
                    {isClient && (
                      <Link to="/custom-orders" className="navbar__mobile-link">Custom Tailoring</Link>
                    )}
                    {isTailors && (
                      <Link to="/tailors/tailoring" className="navbar__mobile-link">Tailoring Jobs</Link>
                    )}
                    {isUser && (
                      <Link to="/orders" className="navbar__mobile-link">My Orders</Link>
                    )}
                    <Link to={getDashboardLink()} className="navbar__mobile-link">Dashboard</Link>
                    <button onClick={handleLogout} className="navbar__mobile-link navbar__mobile-link--danger">Sign Out</button>
                  </>
                )}
                {!isAuthenticated && (
                  <>
                    <Link to="/login" className="navbar__mobile-link">Login</Link>
                    <Link to="/register" className="navbar__mobile-link navbar__mobile-link--primary">Get Started</Link>
                  </>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
