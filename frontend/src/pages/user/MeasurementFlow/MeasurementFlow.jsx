import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Ruler, Scale, User, Shirt, ArrowLeft, ArrowRight, Check, Target } from 'lucide-react';
import { selectIsAuthenticated } from '../../../store/slices/authSlice';
import { useSaveMeasurementMutation, useGetMyMeasurementQuery } from '../../../services/measurementsApi';
import { calculateMeasurements, MEASUREMENT_LABELS } from '../../../utils/measurementCalc';
import './MeasurementFlow.css';

const STEPS = [
  {
    id: 1, title: 'Your Height', subtitle: 'Stand straight — bare feet, against a wall.',
    field: 'height', type: 'number', unit: 'cm', min: 140, max: 220, placeholder: 'e.g. 175',
    Icon: Ruler,
  },
  {
    id: 2, title: 'Your Weight', subtitle: 'Morning weight, without heavy clothing.',
    field: 'weight', type: 'number', unit: 'kg', min: 40, max: 200, placeholder: 'e.g. 72',
    Icon: Scale,
  },
  {
    id: 3, title: 'Your Body Type', subtitle: 'Choose what best describes your natural build.',
    field: 'bodyType', type: 'select', Icon: User,
    options: [
      { value: 'slim', label: 'Slim', desc: 'Lean build, narrower shoulders & chest' },
      { value: 'regular', label: 'Regular', desc: 'Average proportions, balanced build' },
      { value: 'heavy', label: 'Heavy', desc: 'Broader frame, fuller chest & waist' },
    ],
  },
  {
    id: 4, title: 'Fit Preference', subtitle: 'How do you like your clothes to feel?',
    field: 'fitPreference', type: 'select', Icon: Shirt,
    options: [
      { value: 'slim', label: 'Slim Fit', desc: 'Close to body, structured look' },
      { value: 'regular', label: 'Regular Fit', desc: 'Comfortable with room to breathe' },
      { value: 'loose', label: 'Relaxed Fit', desc: 'Generous fit, casual and airy' },
    ],
  },
];

const MeasurementFlow = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [saveMeasurement, { isLoading: saving, error: saveErr }] = useSaveMeasurementMutation();
  const { data: existing } = useGetMyMeasurementQuery(undefined, { skip: !isAuthenticated });

  const [step, setStep] = useState(0);
  const [values, setValues] = useState({ height: '', weight: '', bodyType: '', fitPreference: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (existing?.measurement) {
      const m = existing.measurement;
      setValues({
        height: m.height || '',
        weight: m.weight || '',
        bodyType: m.bodyType || '',
        fitPreference: m.fitPreference || '',
      });
    }
  }, [existing]);

  const currentStep = STEPS[step];
  const StepIcon = currentStep.Icon;
  const progress = ((step + 1) / STEPS.length) * 100;

  const liveMeasurements = values.height && values.weight
    ? calculateMeasurements(values.height, values.weight, values.bodyType || 'regular', values.fitPreference || 'regular')
    : null;

  const validate = () => {
    const field = currentStep.field;
    const val = values[field];
    if (!val && val !== 0) { setErrors({ [field]: `${currentStep.title} is required` }); return false; }
    if (currentStep.type === 'number') {
      const num = parseFloat(val);
      if (isNaN(num) || num < currentStep.min || num > currentStep.max) {
        setErrors({ [field]: `Enter a value between ${currentStep.min} and ${currentStep.max}` });
        return false;
      }
    }
    setErrors({});
    return true;
  };

  const handleNext = () => { if (!validate()) return; if (step < STEPS.length - 1) setStep((s) => s + 1); };

  const handleSkip = () => { if (step < STEPS.length - 1) setStep((s) => s + 1); };

  const handleBack = () => { if (step > 0) setStep((s) => s - 1); };

  const handleSave = async () => {
    if (!validate()) return;
    if (!isAuthenticated) { navigate('/login?redirect=/measure'); return; }
    try {
      await saveMeasurement(values).unwrap();
      navigate('/products');
    } catch { /* error shown via saveErr */ }
  };

  const handleInput = (field, value) => {
    setValues((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors({});
  };

  const isLastStep = step === STEPS.length - 1;
  const saveError = saveErr?.data?.message || (saveErr ? 'Failed to save. Try again.' : '');

  return (
    <div className="measure-page">
      <div className="measure-wizard">
        <div className="measure-wizard__header">
          <div className="measure-wizard__logo">&#10022; FitCraft</div>
          <div className="measure-progress" aria-label="Progress">
            <div className="measure-progress__bar" style={{ width: `${progress}%` }} />
          </div>
          <p className="measure-progress__label">Step {step + 1} of {STEPS.length}</p>
        </div>

        <div className="measure-wizard__body">
          <div className="measure-step animate-fadeUp" key={step}>
            <div className="measure-step__icon"><StepIcon size={40} color="var(--color-gold-muted)" /></div>
            <h2 className="measure-step__title">{currentStep.title}</h2>
            <p className="measure-step__subtitle">{currentStep.subtitle}</p>

            {currentStep.type === 'number' && (
              <div className="measure-input-group">
                <div className="measure-number-input">
                  <input
                    id={currentStep.field} type="number"
                    value={values[currentStep.field]} placeholder={currentStep.placeholder}
                    min={currentStep.min} max={currentStep.max}
                    className={`measure-number-input__field ${errors[currentStep.field] ? 'error' : ''}`}
                    onChange={(e) => handleInput(currentStep.field, e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                    autoFocus aria-label={currentStep.title}
                  />
                  <span className="measure-number-input__unit">{currentStep.unit}</span>
                </div>
                {errors[currentStep.field] && <p className="form-error" role="alert">{errors[currentStep.field]}</p>}
                <div className="measure-range-hint">
                  <span>{currentStep.min}{currentStep.unit}</span>
                  <span>to</span>
                  <span>{currentStep.max}{currentStep.unit}</span>
                </div>
              </div>
            )}

            {currentStep.type === 'select' && (
              <div className="measure-options">
                {currentStep.options.map((opt) => (
                  <button key={opt.value} type="button"
                    className={`measure-option ${values[currentStep.field] === opt.value ? 'active' : ''}`}
                    onClick={() => handleInput(currentStep.field, opt.value)}
                  >
                    <div className="measure-option__content">
                      <span className="measure-option__label">{opt.label}</span>
                      <span className="measure-option__desc">{opt.desc}</span>
                    </div>
                    {values[currentStep.field] === opt.value && (
                      <span className="measure-option__check"><Check size={16} /></span>
                    )}
                  </button>
                ))}
                {errors[currentStep.field] && <p className="form-error" role="alert">{errors[currentStep.field]}</p>}
              </div>
            )}
          </div>
        </div>

        {saveError && <div className="measure-wizard__error" role="alert">{saveError}</div>}

        <div className="measure-wizard__nav">
          <button className="btn btn--ghost" onClick={handleBack} disabled={step === 0}>
            <ArrowLeft size={16} /> Back
          </button>

          { /* skip */}
          {!isLastStep ? (
            <button className="btn btn--primary btn--lg" onClick={handleSkip}>
              skip <ArrowRight size={16} />
            </button>
          ) : null}

          {!isLastStep ? (
            <button className="btn btn--gold btn--lg" onClick={handleNext}>
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button className="btn btn--gold btn--lg" onClick={handleSave} disabled={saving}>
              {saving ? <><span className="spinner" />Saving&hellip;</> : 'Save & Browse Collections'}
            </button>
          )}
        </div>
      </div>

      <aside className="measure-preview">
        <div className="measure-preview__inner">
          <h3 className="measure-preview__title">Your Measurements</h3>
          <p className="measure-preview__subtitle">
            {liveMeasurements ? 'Calculated in real-time from your inputs' : 'Enter your height and weight to see a preview'}
          </p>
          <div className="measure-preview__grid">
            {Object.entries(MEASUREMENT_LABELS).map(([key, { label, unit }]) => {
              const value = liveMeasurements?.[key];
              return (
                <div key={key} className={`measure-preview__item ${value ? 'active' : ''}`}>
                  <span className="measure-preview__label">{label}</span>
                  <span className="measure-preview__value">{value ? `${value} ${unit}` : '—'}</span>
                </div>
              );
            })}
          </div>
          {liveMeasurements && (
            <div className="measure-preview__notice">
              <Target size={16} color="var(--color-gold-muted)" />
              <p>These are your <strong>{values.fitPreference || 'regular'} fit</strong> garment measurements.</p>
            </div>
          )}
          <div className="measure-preview__steps">
            {STEPS.map((s, i) => (
              <div key={s.id} className={`measure-step-dot ${i < step ? 'done' : i === step ? 'current' : ''}`}>
                <div className="measure-step-dot__circle">
                  {i < step ? <Check size={12} /> : s.id}
                </div>
                <span className="measure-step-dot__label">{s.title}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default MeasurementFlow;
