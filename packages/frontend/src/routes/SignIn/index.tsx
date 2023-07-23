import { RouteObject } from 'react-router-dom';
import SignInRequest from './request';

const signInRouteObject: RouteObject = {
  path: 'signin',
  children: [
    {
      path: '',
      element: <SignInRequest />,
    },
  ],
};

export default signInRouteObject;
