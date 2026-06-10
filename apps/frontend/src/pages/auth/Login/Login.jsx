import LoginForm from './components/LoginForm';
import '../Auth.css';

const Login = () => {
  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual__content">
          <span className="auth-visual__logo">✦ FitCraft</span>
          <h2 className="auth-visual__headline">Welcome Back</h2>
          <p className="auth-visual__sub">Your perfect fit is waiting.</p>
          <div className="auth-visual__quote">
            <p>"Clothes mean nothing until someone lives in them."</p>
            <span>— Marc Jacobs</span>
          </div>
        </div>
      </div>
      <LoginForm />
    </div>
  );
};

export default Login;
