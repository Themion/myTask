import { createBrowserRouter } from 'react-router-dom';
import joinRouteObject from './Join';
import rootRouteObject from './Root';

const router = createBrowserRouter([rootRouteObject, joinRouteObject]);

export default router;
