import { RouteObject } from 'react-router-dom';
import SignInConfirm from './confirm';
import SignInRequest from './request';

const signInRouteObject: RouteObject = {
  path: 'signin',
  children: [
    {
      path: '',
      element: <SignInRequest />,
    },
    {
      path: ':uuid',
      element: <SignInConfirm />,
    },
  ],
};

export default signInRouteObject;
