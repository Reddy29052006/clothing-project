import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, logout } from '../../../../store/slices/authSlice';
import '../../../../components/layout/Navbar.css';

const TailorsNavbar = () => {
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
        <Link to="/tailors" className="navbar__logo">
          <span className="navbar__logo-icon" style={{ color: 'var(--color-gold)' }}>✦</span>
          <div className="tailors-navbar-logo">
            <span className="navbar__logo-text">FitCraft</span>
            <span className="tailors-logo-tag">Tailors</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar__nav" aria-label="Tailors Navigation">
          <Link to="/tailors" className={`navbar__link ${location.pathname === '/tailors' ? 'active' : ''}`}>Dashboard</Link>
          <Link to="/tailors/orders" className={`navbar__link ${isActive('/tailors/orders') ? 'active' : ''}`}>Store Orders</Link>
          <Link to="/tailors/tailoring" className={`navbar__link ${isActive('/tailors/tailoring') ? 'active' : ''}`}>Tailoring Jobs</Link>
          <Link to="/tailors/open-orders" className={`navbar__link ${isActive('/tailors/open-orders') ? 'active' : ''}`}>Open Job Board</Link>
          <Link to="/tailors/products" className={`navbar__link ${isActive('/tailors/products') && location.pathname !== '/tailors/products/add' ? 'active' : ''}`}>My Collection</Link>
          <Link to="/tailors/products/add" className={`navbar__link ${isActive('/tailors/products/add') ? 'active' : ''}`}>Add Product</Link>
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
                  <span className="badge badge--gold">Tailors</span>
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
            <Link to="/tailors" className="navbar__mobile-link">Dashboard</Link>
            <Link to="/tailors/orders" className="navbar__mobile-link">Store Orders</Link>
            <Link to="/tailors/tailoring" className="navbar__mobile-link">Tailoring Jobs</Link>
            <Link to="/tailors/open-orders" className="navbar__mobile-link">Open Job Board</Link>
            <Link to="/tailors/products" className="navbar__mobile-link">My Collection</Link>
            <Link to="/tailors/products/add" className="navbar__mobile-link">Add Product</Link>
            <button onClick={handleLogout} className="navbar__mobile-link navbar__mobile-link--danger">Sign Out</button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default TailorsNavbar;
