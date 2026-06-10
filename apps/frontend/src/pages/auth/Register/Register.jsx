import RegisterForm from './components/RegisterForm';
import '../Auth.css';

const Register = () => {
  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual__content">
          <span className="auth-visual__logo">✦ FitCraft</span>
          <h2 className="auth-visual__headline">Begin Your Journey</h2>
          <p className="auth-visual__sub">Clothing crafted exactly to your measurements.</p>
          <div className="auth-visual__features">
            {['Free alteration guarantee', 'Precision fit formula', 'Master-crafted garments', 'Track production live'].map((f) => (
              <div key={f} className="auth-visual__feature">
                <span className="auth-visual__check">✦</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <RegisterForm />
    </div>
  );
};

export default Register;
