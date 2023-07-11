import { createBrowserRouter } from 'react-router-dom';
import welcomeRouteObject from '~/routes/Welcome';
import joinRouteObject from './Join';
import rootRouteObject from './Root';

const router = createBrowserRouter([rootRouteObject, joinRouteObject, welcomeRouteObject]);

export default router;
