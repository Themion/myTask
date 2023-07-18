import { createBrowserRouter } from 'react-router-dom';
import rootRouteObject from './Root';
import signInRouteObject from './SignIn';
import signUpRouteObject from './SignUp';
import welcomeRouteObject from './Welcome';

const router = createBrowserRouter([
  rootRouteObject,
  signInRouteObject,
  signUpRouteObject,
  welcomeRouteObject,
]);

export default router;
