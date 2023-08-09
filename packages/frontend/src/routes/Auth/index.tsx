import { RouteObject } from 'react-router-dom';
import AuthConfirm from './confirm';
import ErrorPage from './error';
import AuthRequest from './request';

const authRouteObject: RouteObject = {
  path: 'auth',
  errorElement: <ErrorPage />,
  children: [
    {
      path: '',
      element: <AuthRequest />,
    },
    {
      path: ':uuid',
      element: <AuthConfirm />,
    },
  ],
};

export default authRouteObject;
