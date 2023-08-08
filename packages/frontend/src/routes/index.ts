import { createBrowserRouter } from 'react-router-dom';
import authRouteObject from './Auth';
import rootRouteObject from './Root';
import signInRouteObject from './SignIn';
import signUpRouteObject from './SignUp';
import welcomeRouteObject from './Welcome';

const router = createBrowserRouter([
  rootRouteObject,
  authRouteObject,
  signInRouteObject,
  signUpRouteObject,
  welcomeRouteObject,
]);

export default router;
