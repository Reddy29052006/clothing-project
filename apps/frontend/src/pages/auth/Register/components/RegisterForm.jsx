import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useRegisterMutation } from '../../../../services/authApi';
import { setCredentials } from '../../../../store/slices/authSlice';
import { AlertTriangle, User, Scissors, Briefcase } from 'lucide-react';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
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

          <button type="submit" className="btn btn--primary btn--lg auth-submit" disabled={isLoading}>
            {isLoading ? <><span className="spinner" />Creating account…</> : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login" className="auth-switch-link">Sign in →</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
