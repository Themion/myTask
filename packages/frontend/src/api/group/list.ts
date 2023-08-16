import { GroupListDTO } from '@my-task/common';
import { useQuery } from '@tanstack/react-query';
import { QueryOptions } from '~/types';
import _fetch from '../core';

const fetchGroupList = (options: QueryOptions<GroupListDTO>) =>
  useQuery({
    queryKey: ['fetchGroupList'],
    queryFn: () => _fetch('/group'),
    ...options,
  });

export default fetchGroupList;
