import VendorNavbar from './components/VendorNavbar';
import Footer from '../../../components/layout/Footer';
import './VendorLayout.css';

const VendorLayout = ({ children }) => (
  <>
    <VendorNavbar />
    <div className="vendor-dashboard-wrapper">
      {children}
    </div>
    <Footer />
  </>
);

export default VendorLayout;
