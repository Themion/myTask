import { createBrowserRouter } from 'react-router-dom';
import authRouteObject from './Auth';
import rootRouteObject from './Root';

const router = createBrowserRouter([rootRouteObject, authRouteObject]);

export default router;
