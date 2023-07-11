import { RouteObject } from 'react-router-dom';
import ErrorPage from './error';
import Welcome from './page';

const welcomeRouteObject: RouteObject = {
  path: 'welcome',
  errorElement: <ErrorPage />,
  children: [
    {
      path: '',
      element: <ErrorPage />,
    },
    {
      path: ':uuid',
      element: <Welcome />,
    },
  ],
};

export default welcomeRouteObject;
