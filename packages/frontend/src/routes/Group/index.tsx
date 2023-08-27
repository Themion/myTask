import { RouteObject } from 'react-router-dom';
import GroupDetail from './Detail';
import GroupList from './List';

const groupRouteObject: RouteObject = {
  path: 'group',
  children: [
    {
      path: '',
      element: <GroupList />,
    },
    {
      path: ':id',
      element: <GroupDetail />,
    },
  ],
};

export default groupRouteObject;
