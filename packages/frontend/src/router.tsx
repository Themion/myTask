import { createBrowserRouter } from 'react-router-dom';
import { Root } from '~/routes';
import Join from '~/routes/Join';

const router = createBrowserRouter([
  { path: '/', element: <Root /> },
  { path: '/join', element: <Join /> },
]);

export default router;
