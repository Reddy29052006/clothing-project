import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import vendorRoutes from './routes/vendorRoutes';
import adminRoutes from './routes/adminRoutes';

//  Router 
const router = createBrowserRouter([
  ...authRoutes,
  ...userRoutes,
  ...vendorRoutes,
  ...adminRoutes,
]);

//  App 
const App = () => <RouterProvider router={router} />;

export default App;
