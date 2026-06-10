import { Link } from 'react-router-dom';

const CTABanner = () => {
  return (
    <section className="cta-banner reveal">
      <div className="container">
        <div className="cta-banner__inner">
          <div className="cta-banner__text">
            <span className="section-label" style={{ color: 'rgba(201,168,76,0.9)' }}>Ready to begin?</span>
            <h2 className="cta-banner__title">Your Perfect Fit Awaits</h2>
            <p className="cta-banner__sub">Join 2,400+ customers who have discovered the luxury of garments made for their unique body.</p>
          </div>
          <div className="cta-banner__actions">
            <Link to="/register" className="btn btn--gold btn--lg">Create Account</Link>
            <Link to="/products" className="btn btn--lg" style={{ background: 'rgba(247,223,185,0.1)', color: '#F7DFB9' }}>Browse Collections</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
