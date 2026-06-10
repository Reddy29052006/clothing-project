import { Ruler, Scissors, Package, Shirt, RefreshCcw } from 'lucide-react';

export const TESTIMONIALS = [
  { id: 1, quote: "I was skeptical about online custom tailoring. But the Heritage Shirt fit me like it was made for me — because it was.", author: "Arjun Mehta", role: "Business Consultant, Mumbai", rating: 5 },
  { id: 2, quote: "The Nawab Kurta arrived just in time for Diwali. The Chanderi silk, the fit, the craftsmanship — everything was exactly what luxury should deliver.", author: "Priya Nair", role: "Creative Director, Bangalore", rating: 5 },
  { id: 3, quote: "Three suits in three months. Each better than the last. FitCraft isn't just a service — it's a relationship.", author: "Vikram Reddy", role: "Entrepreneur, Hyderabad", rating: 5 },
];

export const HOW_IT_WORKS = [
  { step: '01', title: 'Share Your Measurements', description: 'Our intelligent wizard guides you through four simple steps. Height, weight, body type — and we handle the rest with precision formulas.', Icon: Ruler },
  { step: '02', title: 'Choose & Customize', description: 'Browse premium fabrics, select from curated color palettes, and choose your preferred fit — slim, regular, or relaxed.', Icon: Scissors },
  { step: '03', title: 'Crafted & Delivered', description: 'Our master artisans begin work immediately. Track every stage of production and receive your garment within 10 days.', Icon: Package },
];

export const VALUE_PROPS = [
  { Icon: Scissors, title: 'Master Craftsmen', desc: 'Each garment is hand-crafted by skilled artisans with decades of experience.' },
  { Icon: Ruler, title: 'Precision Fit Engine', desc: 'Our rule-based system calculates 7 garment dimensions from 4 simple inputs.' },
  { Icon: Shirt, title: 'Premium Fabrics', desc: 'Egyptian cotton, Italian wool, Chanderi silk — sourced from the finest mills.' },
  { Icon: RefreshCcw, title: 'Fit Guarantee', desc: 'Not happy with the fit? We adjust it. Free. No questions asked.' },
];
