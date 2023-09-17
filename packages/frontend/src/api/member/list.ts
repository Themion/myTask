import { MemberListDTO, mergeObjects } from '@my-task/common';
import { useMutation } from '@tanstack/react-query';
import { HttpMethod } from '~/constants';
import { MemberListParam, MutationOptions } from '~/types';
import { objectToQueryString } from '~/utils';
import _fetch from '../core';

const fetchMemberList = (options: MutationOptions<MemberListDTO>) =>
  useMutation({
    mutationKey: ['fetchMemberList'],
    mutationFn: (param: MemberListParam) => {
      const { groupId, page } = mergeObjects(param, { page: 1 }) as Required<MemberListParam>;
      const queryString = objectToQueryString({ page });

      return _fetch(`/member/${groupId}${queryString}`, {
        method: HttpMethod.GET,
      });
    },
    ...options,
  });

export default fetchMemberList;
