import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useRegisterMutation, useGoogleLoginMutation } from '../../../../services/authApi';
import { setCredentials } from '../../../../store/slices/authSlice';
import { AlertTriangle, User, Scissors, Briefcase } from 'lucide-react';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: 'user', shopName: '', phone: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const roleRef = useRef(form.role);
  useEffect(() => {
    roleRef.current = form.role;
  }, [form.role]);

  useEffect(() => {
    // Only load Google GSI if Client ID is configured
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (clientId) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
          });

          const parent = document.getElementById('google-signup-btn');
          if (parent) {
            window.google.accounts.id.renderButton(parent, {
              theme: 'outline',
              size: 'large',
              width: '380',
            });
          }
        }
      };

      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      const data = await googleLogin({ token: response.credential }).unwrap();
      dispatch(setCredentials({ user: data.user, token: data.token }));
      if (data.user.role === 'pending_onboarding') {
        navigate('/onboarding');
      } else {
        if (data.user.role === 'admin') navigate('/admin');
        else if (data.user.role === 'tailors') navigate('/tailors');
        else if (data.user.role === 'client') navigate('/custom-orders');
        else navigate('/measure');
      }
    } catch (err) {
      setApiError(err?.data?.message || 'Google registration failed.');
    }
  };

  const handleMockGoogleLogin = async () => {
    const mockToken = `mock_google_token_${Math.random().toString(36).substring(2, 10)}`;
    try {
      const data = await googleLogin({ token: mockToken }).unwrap();
      dispatch(setCredentials({ user: data.user, token: data.token }));
      if (data.user.role === 'pending_onboarding') {
        navigate('/onboarding');
      } else {
        if (data.user.role === 'admin') navigate('/admin');
        else if (data.user.role === 'tailors') navigate('/tailors');
        else if (data.user.role === 'client') navigate('/custom-orders');
        else navigate('/measure');
      }
    } catch (err) {
      setApiError(err?.data?.message || 'Google signup simulation failed.');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((p) => ({ ...p, [e.target.name]: '' }));
    setApiError('');
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email) errs.email = 'Email is required';
    if (!form.password || form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (form.role === 'tailors' && !form.shopName.trim()) errs.shopName = 'Shop name is required for tailors';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const payload = { name: form.name, email: form.email, password: form.password, role: form.role, phone: form.phone };
      if (form.role === 'tailors') payload.shopName = form.shopName;
      const data = await register(payload).unwrap();
      dispatch(setCredentials({ user: data.user, token: data.token }));
      if (data.user.role === 'tailors') navigate('/tailors');
      else if (data.user.role === 'client') navigate('/custom-orders');
      else navigate('/measure');
    } catch (err) {
      setApiError(err?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-form-section">
      <div className="auth-form-wrapper">
        <div className="auth-form-header">
          <Link to="/" className="auth-back-link">← Back to Home</Link>
          <h1 className="auth-form-title">Create Account</h1>
          <p className="auth-form-subtitle">Join thousands of satisfied customers</p>
        </div>

        {/* Role Selector */}
        <div className="auth-role-selector" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <button type="button" className={`auth-role-btn ${form.role === 'user' ? 'active' : ''}`} onClick={() => setForm({ ...form, role: 'user' })}><User size={14} /> Customer</button>
          <button type="button" className={`auth-role-btn ${form.role === 'client' ? 'active' : ''}`} onClick={() => setForm({ ...form, role: 'client' })}><Briefcase size={14} /> Client</button>
          <button type="button" className={`auth-role-btn ${form.role === 'tailors' ? 'active' : ''}`} onClick={() => setForm({ ...form, role: 'tailors' })}><Scissors size={14} /> Tailors</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {apiError && <div className="auth-error" role="alert"><AlertTriangle size={16} /> {apiError}</div>}

          <div className="form-group">
            <label htmlFor="reg-name" className="form-label">Full Name <span className="required">*</span></label>
            <input id="reg-name" name="name" type="text" className={`form-input ${errors.name ? 'error' : ''}`} placeholder="Rahul Sharma" value={form.name} onChange={handleChange} />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="reg-email" className="form-label">Email Address <span className="required">*</span></label>
            <input id="reg-email" name="email" type="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="you@example.com" value={form.email} onChange={handleChange} />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="reg-phone" className="form-label">Phone Number</label>
            <input id="reg-phone" name="phone" type="tel" className="form-input" placeholder="+91 9876543210" value={form.phone} onChange={handleChange} />
          </div>

          {form.role === 'tailors' && (
            <div className="form-group">
              <label htmlFor="reg-shop" className="form-label">Shop Name <span className="required">*</span></label>
              <input id="reg-shop" name="shopName" type="text" className={`form-input ${errors.shopName ? 'error' : ''}`} placeholder="Arjun Master Tailors" value={form.shopName} onChange={handleChange} />
              {errors.shopName && <p className="form-error">{errors.shopName}</p>}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="reg-password" className="form-label">Password <span className="required">*</span></label>
            <input id="reg-password" name="password" type="password" className={`form-input ${errors.password ? 'error' : ''}`} placeholder="Min 6 characters" value={form.password} onChange={handleChange} />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="reg-confirm" className="form-label">Confirm Password <span className="required">*</span></label>
            <input id="reg-confirm" name="confirmPassword" type="password" className={`form-input ${errors.confirmPassword ? 'error' : ''}`} placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} />
            {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" className="btn btn--primary btn--lg auth-submit" disabled={isLoading || isGoogleLoading}>
            {isLoading ? <><span className="spinner" />Creating account…</> : 'Create Account'}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <div className="google-btn-container" style={{ display: 'flex', justifyContent: 'center' }}>
          {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
            <div id="google-signup-btn" />
          ) : (
            <button
              type="button"
              className="btn btn--secondary btn--lg"
              style={{ width: '100%', justifyContent: 'center', gap: '0.5rem' }}
              onClick={handleMockGoogleLogin}
              disabled={isGoogleLoading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              Connect with Google (Dev Mock)
            </button>
          )}
        </div>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login" className="auth-switch-link">Sign in →</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
