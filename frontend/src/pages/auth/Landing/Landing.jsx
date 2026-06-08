import { useReveal } from './hooks/useReveal';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import FeaturedProducts from './components/FeaturedProducts';
import ValueProps from './components/ValueProps';
import Testimonials from './components/Testimonials';
import CTABanner from './components/CTABanner';
import './Landing.css';

const Landing = () => {
  useReveal();

  return (
    <main className="landing">
      <Hero />
      <HowItWorks />
      <FeaturedProducts />
      <ValueProps />
      <Testimonials />
      <CTABanner />
    </main>
  );
};

export default Landing;
