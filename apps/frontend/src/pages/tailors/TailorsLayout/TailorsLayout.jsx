import TailorsNavbar from './components/TailorsNavbar';
import Footer from '../../../components/layout/Footer';
import './TailorsLayout.css';

const TailorsLayout = ({ children }) => (
  <>
    <TailorsNavbar />
    <div className="tailors-dashboard-wrapper">
      {children}
    </div>
    <Footer />
  </>
);

export default TailorsLayout;
