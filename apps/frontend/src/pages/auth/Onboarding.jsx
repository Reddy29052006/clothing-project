import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCompleteOnboardingMutation } from '../../services/authApi';
import { setCredentials, selectCurrentUser, selectCurrentToken } from '../../store/slices/authSlice';
import { AlertTriangle, User, Scissors, Briefcase } from 'lucide-react';
import './Onboarding.css';

const Onboarding = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const currentToken = useSelector(selectCurrentToken);

  const [completeOnboarding, { isLoading }] = useCompleteOnboardingMutation();
  const [form, setForm] = useState({
    role: 'user',
    phone: '',
    shopName: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((p) => ({ ...p, [e.target.name]: '' }));
    setApiError('');
  };

  const validate = () => {
    const errs = {};
    if (!form.role) errs.role = 'Please select a role';
    if (form.role === 'tailors' && !form.shopName.trim()) {
      errs.shopName = 'Shop name is required for tailors';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = { role: form.role, phone: form.phone };
      if (form.role === 'tailors') {
        payload.shopName = form.shopName;
      }
      
      const data = await completeOnboarding(payload).unwrap();
      
      // Update local credentials with new role and updated details
      dispatch(setCredentials({ user: data.user, token: data.token || currentToken }));

      // Redirect based on selected role
      if (data.user.role === 'tailors') {
        navigate('/tailors');
      } else if (data.user.role === 'client') {
        navigate('/custom-orders');
      } else {
        navigate('/measure');
      }
    } catch (err) {
      setApiError(err?.data?.message || 'Failed to complete profile. Please try again.');
    }
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-card animate-fadeUp">
        <div className="onboarding-header">
          <span className="onboarding-logo">✦ FitCraft</span>
          <h1 className="onboarding-title">Complete Your Profile</h1>
          <p className="onboarding-subtitle">
            Welcome, <strong>{currentUser?.name}</strong>! Let's get you set up on the platform.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="onboarding-form" noValidate>
          {apiError && (
            <div className="auth-error animate-shake" role="alert">
              <AlertTriangle size={16} /> {apiError}
            </div>
          )}

          {/* Role Selection */}
          <div className="form-group">
            <label className="form-label">How will you use FitCraft? <span className="required">*</span></label>
            <div className="onboarding-role-grid">
              <button
                type="button"
                className={`onboarding-role-card ${form.role === 'user' ? 'active' : ''}`}
                onClick={() => setForm({ ...form, role: 'user' })}
              >
                <div className="role-icon-box"><User size={24} /></div>
                <div className="role-text-box">
                  <h3>Customer</h3>
                  <p>Order custom-fit clothes made for your unique body type.</p>
                </div>
              </button>

              <button
                type="button"
                className={`onboarding-role-card ${form.role === 'client' ? 'active' : ''}`}
                onClick={() => setForm({ ...form, role: 'client' })}
              >
                <div className="role-icon-box"><Briefcase size={24} /></div>
                <div className="role-text-box">
                  <h3>B2B Client</h3>
                  <p>Order bulk tailoring, corporate uniforms, and designer apparel.</p>
                </div>
              </button>

              <button
                type="button"
                className={`onboarding-role-card ${form.role === 'tailors' ? 'active' : ''}`}
                onClick={() => setForm({ ...form, role: 'tailors' })}
              >
                <div className="role-icon-box"><Scissors size={24} /></div>
                <div className="role-text-box">
                  <h3>Tailor / Artisan</h3>
                  <p>Receive stitching requests, pattern jobs, and fulfill orders.</p>
                </div>
              </button>
            </div>
          </div>

          {/* Phone Input */}
          <div className="form-group">
            <label htmlFor="onboard-phone" className="form-label">Phone Number</label>
            <input
              id="onboard-phone"
              name="phone"
              type="tel"
              className="form-input"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          {/* Tailor Shop Name */}
          {form.role === 'tailors' && (
            <div className="form-group animate-slideDown">
              <label htmlFor="onboard-shop" className="form-label">Shop / Atelier Name <span className="required">*</span></label>
              <input
                id="onboard-shop"
                name="shopName"
                type="text"
                className={`form-input ${errors.shopName ? 'error' : ''}`}
                placeholder="Royal Artisan Tailors"
                value={form.shopName}
                onChange={handleChange}
              />
              {errors.shopName && <p className="form-error">{errors.shopName}</p>}
            </div>
          )}

          <button
            type="submit"
            className="btn btn--primary btn--lg onboarding-submit"
            disabled={isLoading}
          >
            {isLoading ? <><span className="spinner" /> Saving Profile…</> : 'Complete Setup ✦'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
