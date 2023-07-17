import { createBrowserRouter } from 'react-router-dom';
import welcomeRouteObject from '~/routes/Welcome';
import rootRouteObject from './Root';
import signUpRouteObject from './SignUp';

const router = createBrowserRouter([rootRouteObject, signUpRouteObject, welcomeRouteObject]);

export default router;
