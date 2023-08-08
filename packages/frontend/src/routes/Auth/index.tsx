import { RouteObject } from 'react-router-dom';
import AuthConfirm from './confirm';
import AuthRequest from './request';
import ErrorPage from './error';

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
