import { Outlet, createBrowserRouter } from 'react-router-dom';
import { Header } from '~/layouts';
import authRouteObject from './Auth';
import groupRouteObject from './Group';
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
    children: [rootRouteObject, authRouteObject, groupRouteObject],
  },
]);

export default router;
