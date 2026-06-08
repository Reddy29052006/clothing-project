import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <span className="footer__logo-icon">✦</span>
            <span>FitCraft</span>
          </Link>
          <p className="footer__tagline">
            Every stitch tells your story.<br />Crafted to fit you perfectly.
          </p>
          <div className="footer__socials">
            <a href="#" aria-label="Instagram" className="footer__social">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
            </a>
            <a href="#" aria-label="Pinterest" className="footer__social">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.23-5.24 1.23-5.24s-.31-.63-.31-1.56c0-1.46.85-2.56 1.9-2.56.9 0 1.33.67 1.33 1.48 0 .9-.57 2.25-.87 3.51-.25 1.05.52 1.9 1.55 1.9 1.86 0 3.11-2.4 3.11-5.25 0-2.16-1.46-3.67-3.55-3.67-2.42 0-3.84 1.81-3.84 3.69 0 .73.28 1.51.63 1.94a.25.25 0 01.06.24l-.23.95c-.04.14-.13.17-.3.1-1.1-.52-1.79-2.14-1.79-3.44 0-2.8 2.04-5.37 5.87-5.37 3.08 0 5.47 2.19 5.47 5.12 0 3.06-1.93 5.51-4.6 5.51-.9 0-1.74-.47-2.03-1.02l-.55 2.06c-.2.77-.74 1.73-1.1 2.32.83.26 1.71.4 2.62.4 5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
            </a>
          </div>
        </div>

        <div className="footer__links">
          <div className="footer__col">
            <h4 className="footer__col-title">Shop</h4>
            <Link to="/products" className="footer__link">All Collections</Link>
            <Link to="/products?category=shirt" className="footer__link">Shirts</Link>
            <Link to="/products?category=trousers" className="footer__link">Trousers</Link>
            <Link to="/products?category=suit" className="footer__link">Suits</Link>
            <Link to="/products?category=kurta" className="footer__link">Kurtas</Link>
          </div>
          <div className="footer__col">
            <h4 className="footer__col-title">Craft</h4>
            <Link to="/measure" className="footer__link">Get Measured</Link>
            <Link to="/orders/track" className="footer__link">Track Order</Link>
            <Link to="/dashboard" className="footer__link">My Dashboard</Link>
          </div>
          <div className="footer__col">
            <h4 className="footer__col-title">Company</h4>
            <a href="#" className="footer__link">About Us</a>
            <a href="#" className="footer__link">Our Artisans</a>
            <a href="#" className="footer__link">Sustainability</a>
            <a href="#" className="footer__link">Contact</a>
          </div>
        </div>
      </div>

      <div className="footer__bottom container">
        <p className="footer__copyright">
          © {new Date().getFullYear()} FitCraft. Crafted with care in India.
        </p>
        <div className="footer__legal">
          <a href="#" className="footer__legal-link">Privacy Policy</a>
          <a href="#" className="footer__legal-link">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
