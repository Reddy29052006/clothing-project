import { useState } from 'react';
import { X } from 'lucide-react';

const FeedbackModal = ({ order, onClose, onSubmit, isSubmitting }) => {
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  const options = [
    { value: 'tight', label: 'Too Tight', emoji: '😬', desc: 'Needs more room' },
    { value: 'perfect', label: 'Perfect Fit', emoji: '😍', desc: 'Just right' },
    { value: 'loose', label: 'Too Loose', emoji: '😕', desc: 'Needs to be slimmer' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">How Did It Fit?</h3>
          <button className="btn btn--ghost btn--icon" onClick={onClose}><X size={18} /></button>
        </div>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: 'var(--text-sm)' }}>
          Your feedback helps us craft an even better fit next time.
        </p>
        <div className="feedback-rating-btns">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`feedback-btn ${rating === opt.value ? 'active' : ''}`}
              onClick={() => setRating(opt.value)}
            >
              <span className="feedback-btn__icon">{opt.emoji}</span>
              <span className="feedback-btn__label">{opt.label}</span>
              <span className="feedback-btn__desc">{opt.desc}</span>
            </button>
          ))}
        </div>
        <div className="form-group" style={{ marginTop: '1.5rem' }}>
          <label className="form-label">Additional Comments (optional)</label>
          <textarea className="form-textarea" rows={3} placeholder="Tell us more about the fit…"
            value={comment} onChange={(e) => setComment(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" style={{ flex: 1 }} disabled={!rating || isSubmitting}
            onClick={() => onSubmit(order._id, rating, comment)}>
            {isSubmitting ? <><span className="spinner" />Submitting…</> : 'Submit Feedback'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
