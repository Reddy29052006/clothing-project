import { Link } from 'react-router-dom';
import { Ruler, ShieldCheck, ArrowRight, Shirt } from 'lucide-react';

const Hero = () => {
  return (
    <section className="hero" aria-label="Hero">
      <div className="hero__bg"><div className="hero__gradient" /></div>
      <div className="hero__content container">
        <div className="hero__text animate-fadeUp">
          <span className="section-label" style={{ color: 'rgba(201,168,76,0.9)' }}>✦ Premium Custom Tailoring</span>
          <h1 className="hero__headline">Crafted to Fit<br /><em>You Perfectly</em></h1>
          <p className="hero__sub">Precision measurements. Master craftsmen. Garments that feel like a second skin.</p>
          <div className="hero__cta">
            <Link to="/measure" className="btn btn--gold btn--lg">
              Start Your Custom Fit
              <ArrowRight size={18} />
            </Link>
            <Link to="/products" className="btn btn--lg" style={{ background: 'rgba(255,255,255,0.1)', color: '#F7DFB9', backdropFilter: 'blur(4px)' }}>
              View Collections
            </Link>
          </div>
          <div className="hero__stats">
            <div className="hero__stat"><span className="hero__stat-value">2,400+</span><span className="hero__stat-label">Happy Customers</span></div>
            <div className="hero__stat-divider" />
            <div className="hero__stat"><span className="hero__stat-value">48</span><span className="hero__stat-label">Master Artisans</span></div>
            <div className="hero__stat-divider" />
            <div className="hero__stat"><span className="hero__stat-value">10 Days</span><span className="hero__stat-label">Delivery Guarantee</span></div>
          </div>
        </div>
        <div className="hero__visual animate-fadeLeft delay-200">
          <div className="hero__card hero__card--float animate-float">
            <div className="hero__card-icon"><Ruler size={24} color="var(--color-primary)" /></div>
            <div><p className="hero__card-title">Your Measurements</p><p className="hero__card-sub">Chest: 96cm · Waist: 82cm</p></div>
          </div>
          <div className="hero__image-frame">
            <div className="hero__image-placeholder">
              <div className="hero__image-icon"><Shirt size={48} color="var(--color-gold)" /></div>
              <p>Bespoke Tailoring</p>
            </div>
          </div>
          <div className="hero__card hero__card--bottom animate-float delay-300">
            <div className="hero__card-icon"><ShieldCheck size={24} color="var(--color-success)" /></div>
            <div><p className="hero__card-title">Perfect Fit Guarantee</p><p className="hero__card-sub">Free alteration if needed</p></div>
          </div>
        </div>
      </div>
      <div className="hero__scroll-hint"><div className="hero__scroll-dot" /><span>Scroll to explore</span></div>
    </section>
  );
};

export default Hero;
