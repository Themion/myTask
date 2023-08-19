import { RouteObject } from 'react-router-dom';
import GroupList from './List';

const groupRouteObject: RouteObject = {
  path: 'group',
  element: <GroupList />,
};

export default groupRouteObject;
