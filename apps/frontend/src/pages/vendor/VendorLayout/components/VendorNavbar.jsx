import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, logout } from '../../../../store/slices/authSlice';
import '../../../../components/layout/Navbar.css';

const VendorNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectCurrentUser);

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        <Link to="/vendor" className="navbar__logo">
          <span className="navbar__logo-icon" style={{ color: 'var(--color-gold)' }}>✦</span>
          <div className="vendor-navbar-logo">
            <span className="navbar__logo-text">FitCraft</span>
            <span className="vendor-logo-tag">Vendor</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar__nav" aria-label="Vendor Navigation">
          <Link to="/vendor" className={`navbar__link ${location.pathname === '/vendor' ? 'active' : ''}`}>Dashboard</Link>
          <Link to="/vendor/orders" className={`navbar__link ${isActive('/vendor/orders') ? 'active' : ''}`}>Orders</Link>
          <Link to="/vendor/products" className={`navbar__link ${isActive('/vendor/products') && location.pathname !== '/vendor/products/add' ? 'active' : ''}`}>My Collection</Link>
          <Link to="/vendor/products/add" className={`navbar__link ${isActive('/vendor/products/add') ? 'active' : ''}`}>Add Product</Link>
        </nav>

        {/* Actions */}
        <div className="navbar__actions">
          <div className="navbar__user" ref={dropdownRef}>
            <button
              className="navbar__avatar"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
              aria-label="User menu"
              style={{ background: 'var(--color-gold)' }}
            >
              <span style={{ color: 'var(--color-primary)' }}>{user?.name?.[0]?.toUpperCase() || 'V'}</span>
            </button>

            {dropdownOpen && (
              <div className="navbar__dropdown animate-fadeDown">
                <div className="navbar__dropdown-header">
                  <p className="navbar__dropdown-name">{user?.name}</p>
                  <p className="navbar__dropdown-email">{user?.email}</p>
                  <span className="badge badge--gold">Vendor</span>
                </div>
                <div className="divider" style={{ margin: '0.5rem 0' }} />
                <button onClick={handleLogout} className="navbar__dropdown-item navbar__dropdown-item--danger">
                  Sign Out
                </button>
              </div>
            )}
          </div>

          <button
            className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="navbar__mobile animate-fadeDown">
          <nav className="navbar__mobile-nav">
            <Link to="/vendor" className="navbar__mobile-link">Dashboard</Link>
            <Link to="/vendor/orders" className="navbar__mobile-link">Orders</Link>
            <Link to="/vendor/products" className="navbar__mobile-link">My Collection</Link>
            <Link to="/vendor/products/add" className="navbar__mobile-link">Add Product</Link>
            <button onClick={handleLogout} className="navbar__mobile-link navbar__mobile-link--danger">Sign Out</button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default VendorNavbar;
