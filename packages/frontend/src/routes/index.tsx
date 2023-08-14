import { Outlet, createBrowserRouter } from 'react-router-dom';
import { Header } from '~/layouts';
import authRouteObject from './Auth';
import rootRouteObject from './Root';

const router = createBrowserRouter([
  {
    path: '',
    element: (
      <>
        <Header />
        <Outlet />
      </>
    ),
    children: [rootRouteObject, authRouteObject],
  },
]);

export default router;
