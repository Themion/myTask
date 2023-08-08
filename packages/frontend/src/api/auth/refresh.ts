import { RefreshedDTO } from '@my-task/common';
import { useQuery } from '@tanstack/react-query';
import { QueryOptions } from '~/types';
import _fetch from '../core';

const refreshAuth = (option: QueryOptions<RefreshedDTO>) =>
  useQuery({
    queryFn: () => _fetch('/auth', { method: 'GET' }),
    ...option,
  });

export default refreshAuth;
