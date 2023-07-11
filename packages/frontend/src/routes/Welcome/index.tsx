import { RouteObject } from 'react-router-dom';
import Welcome from './page';

const welcomeRouteObject: RouteObject = {
  path: 'welcome',
  children: [
    {
      path: ':uuid',
      element: <Welcome />,
    },
  ],
};

export default welcomeRouteObject;
