import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../../../services/authApi';
import { setCredentials } from '../../../../store/slices/authSlice';
import { AlertTriangle, User, Scissors, Shield, Briefcase } from 'lucide-react';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [login, { isLoading }] = useLoginMutation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }
    try {
      const data = await login(form).unwrap();
      dispatch(setCredentials({ user: data.user, token: data.token }));
      if (data.user.role === 'admin') navigate('/admin');
      else if (data.user.role === 'tailors') navigate('/tailors');
      else if (data.user.role === 'client') navigate('/custom-orders');
      else navigate(redirect);
    } catch (err) {
      setError(err?.data?.message || 'Login failed. Check your credentials.');
    }
  };

  const fillDemo = (email, password) => setForm({ email, password });

  return (
    <div className="auth-form-section">
      <div className="auth-form-wrapper">
        <div className="auth-form-header">
          <Link to="/" className="auth-back-link">← Back to Home</Link>
          <h1 className="auth-form-title">Sign In</h1>
          <p className="auth-form-subtitle">Enter your credentials to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {error && (
            <div className="auth-error" role="alert">
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="login-email" className="form-label">Email Address</label>
            <input
              id="login-email" name="email" type="email" autoComplete="email"
              className="form-input" placeholder="you@example.com"
              value={form.email} onChange={handleChange} required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password" className="form-label">Password</label>
            <input
              id="login-password" name="password" type="password" autoComplete="current-password"
              className="form-input" placeholder="Your password"
              value={form.password} onChange={handleChange} required
            />
          </div>

          <button type="submit" className="btn btn--primary btn--lg auth-submit" disabled={isLoading}>
            {isLoading ? <><span className="spinner" /> Signing in…</> : 'Sign In'}
          </button>
        </form>

        <div className="auth-demo-accounts">
          <p className="auth-demo-label">Demo accounts — click to fill:</p>
          <div className="auth-demo-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <button type="button" className="auth-demo-btn" onClick={() => fillDemo('user@fitcraft.com', 'user1234')}><User size={14} /> Customer</button>
            <button type="button" className="auth-demo-btn" onClick={() => fillDemo('client@fitcraft.com', 'user1234')}><Briefcase size={14} /> Client</button>
            <button type="button" className="auth-demo-btn" onClick={() => fillDemo('tailors@fitcraft.com', 'tailors123')}><Scissors size={14} /> Tailors</button>
            <button type="button" className="auth-demo-btn" onClick={() => fillDemo('admin@fitcraft.com', 'Admin@123')}><Shield size={14} /> Admin</button>
          </div>
        </div>

        <p className="auth-switch">
          Don't have an account?{' '}
          <Link to="/register" className="auth-switch-link">Create one →</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
