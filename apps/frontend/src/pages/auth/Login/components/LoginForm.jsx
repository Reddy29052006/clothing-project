import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation, useGoogleLoginMutation } from '../../../../services/authApi';
import { setCredentials } from '../../../../store/slices/authSlice';
import { AlertTriangle, User, Scissors, Shield, Briefcase } from 'lucide-react';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [login, { isLoading }] = useLoginMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

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

          const parent = document.getElementById('google-signin-btn');
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
        else navigate(redirect);
      }
    } catch (err) {
      setError(err?.data?.message || 'Google login failed.');
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
        else navigate(redirect);
      }
    } catch (err) {
      setError(err?.data?.message || 'Google login simulation failed.');
    }
  };

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

          <button type="submit" className="btn btn--primary btn--lg auth-submit" disabled={isLoading || isGoogleLoading}>
            {isLoading ? <><span className="spinner" /> Signing in…</> : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <div className="google-btn-container" style={{ display: 'flex', justifyContent: 'center' }}>
          {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
            <div id="google-signin-btn" />
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
