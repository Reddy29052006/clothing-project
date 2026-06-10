import { useState, useEffect } from 'react';
import { TESTIMONIALS } from '../data/landingData';
import { Star } from 'lucide-react';

const StarRating = ({ rating }) => (
  <div className="stars" style={{ display: 'flex', gap: '2px', color: 'var(--color-gold)' }}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Star key={n} size={14} fill={n <= Math.round(rating) ? 'currentColor' : 'none'} strokeWidth={n <= Math.round(rating) ? 0 : 2} />
    ))}
  </div>
);

const Testimonials = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial((p) => (p + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="section testimonials" aria-labelledby="testimonials-heading">
      <div className="container">
        <div className="text-center reveal">
          <span className="section-label">What They Say</span>
          <h2 id="testimonials-heading" className="section-title">Stories Stitched in Satisfaction</h2>
        </div>
        <div className="testimonials__carousel">
          <div className="testimonial-card animate-fadeIn" key={activeTestimonial}>
            <div className="testimonial-card__quote">"</div>
            <blockquote className="testimonial-card__text">{TESTIMONIALS[activeTestimonial].quote}</blockquote>
            <div className="testimonial-card__footer">
              <div className="testimonial-card__avatar">{TESTIMONIALS[activeTestimonial].author[0]}</div>
              <div>
                <p className="testimonial-card__author">{TESTIMONIALS[activeTestimonial].author}</p>
                <p className="testimonial-card__role">{TESTIMONIALS[activeTestimonial].role}</p>
              </div>
              <div className="testimonial-card__stars"><StarRating rating={TESTIMONIALS[activeTestimonial].rating} /></div>
            </div>
          </div>
          <div className="testimonials__dots">
            {TESTIMONIALS.map((_, i) => (
              <button 
                key={i} 
                className={`testimonials__dot ${i === activeTestimonial ? 'active' : ''}`} 
                onClick={() => setActiveTestimonial(i)} 
                aria-label={`Testimonial ${i + 1}`} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
