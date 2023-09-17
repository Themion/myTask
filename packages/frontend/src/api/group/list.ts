import { GroupListDTO, mergeObjects } from '@my-task/common';
import { useQuery } from '@tanstack/react-query';
import { GroupListParam, QueryOptions } from '~/types';
import { objectToQueryString } from '~/utils';
import _fetch from '../core';

const fetchGroupList = (options: QueryOptions<GroupListDTO>, param: Partial<GroupListParam>) =>
  useQuery({
    queryKey: ['fetchGroupList', (param.page ?? 1).toString()],
    queryFn: () => {
      const queryObject = mergeObjects(param, { page: 1 }) as GroupListParam;
      const queryString = objectToQueryString(queryObject);
      return _fetch(`/group${queryString}`);
    },
    ...options,
  });

export default fetchGroupList;
