import { GroupListDTO } from '@my-task/common';
import { useQuery } from '@tanstack/react-query';
import { GroupListParam, QueryOptions } from '~/types';
import _fetch from '../core';

const fetchGroupList = (options: QueryOptions<GroupListDTO>, param: Partial<GroupListParam>) =>
  useQuery({
    queryKey: ['fetchGroupList', (param.page ?? 1).toString()],
    queryFn: () => {
      const paramArr = Object.entries(param).map(([key, value]) => `${key}=${value}`);
      return _fetch(`/group?${paramArr.join('&')}`);
    },
    ...options,
  });

export default fetchGroupList;
