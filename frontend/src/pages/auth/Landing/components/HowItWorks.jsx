import { Link } from 'react-router-dom';
import { HOW_IT_WORKS } from '../data/landingData';
import { ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  return (
    <section className="section how-it-works" aria-labelledby="how-heading">
      <div className="container">
        <div className="section-header text-center reveal">
          <span className="section-label">How It Works</span>
          <h2 id="how-heading" className="section-title">Three Steps to Your Perfect Garment</h2>
          <p className="section-subtitle">A seamless experience from first measurement to delivery.</p>
        </div>
        <div className="how-it-works__grid">
          {HOW_IT_WORKS.map((s, i) => {
            const Icon = s.Icon;
            return (
              <div key={s.step} className={`how-card reveal delay-${(i + 1) * 200}`}>
                <div className="how-card__step">{s.step}</div>
                <div className="how-card__icon"><Icon size={32} /></div>
                <h3 className="how-card__title">{s.title}</h3>
                <p className="how-card__desc">{s.description}</p>
                {i < HOW_IT_WORKS.length - 1 && <div className="how-card__connector" aria-hidden="true" />}
              </div>
            );
          })}
        </div>
        <div className="text-center reveal delay-600" style={{ marginTop: '3rem' }}>
          <Link to="/measure" className="btn btn--primary btn--lg">
            Begin Your Journey <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
