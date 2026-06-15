import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import tailorsRoutes from './routes/tailorsRoutes';
import clientRoutes from './routes/clientRoutes';
import adminRoutes from './routes/adminRoutes';

//  Router 
const router = createBrowserRouter([
  ...authRoutes,
  ...userRoutes,
  ...tailorsRoutes,
  ...clientRoutes,
  ...adminRoutes,
]);

//  App 
const App = () => <RouterProvider router={router} />;

export default App;
