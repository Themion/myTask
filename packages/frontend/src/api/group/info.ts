import { GroupInfoDTO } from '@my-task/common';
import { useQuery } from '@tanstack/react-query';
import { QueryOptions } from '~/types';
import _fetch from '../core';

const fetchGroupInfo = (groupId: number, options: QueryOptions<GroupInfoDTO>) =>
  useQuery({
    queryKey: ['fetchGroupInfo', groupId.toString()],
    queryFn: () => _fetch(`/group/${groupId}`),
    ...options,
  });

export default fetchGroupInfo;
