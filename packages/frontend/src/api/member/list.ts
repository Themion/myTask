import { MemberListDTO } from '@my-task/common';
import { useMutation } from '@tanstack/react-query';
import { HttpMethod } from '~/constants';
import { MemberListParam, MutationOptions } from '~/types';
import _fetch from '../core';

const fetchMemberList = (options: MutationOptions<MemberListDTO>) =>
  useMutation({
    mutationKey: ['fetchMemberList'],
    mutationFn: (param: MemberListParam) => {
      const { groupId, page } = param;

      const queryString = Object.entries({ page })
        .filter(([_, value]) => !!value)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

      return _fetch(`/member/${groupId}${queryString && `?${queryString}`}`, {
        method: HttpMethod.GET,
      });
    },
    ...options,
  });

export default fetchMemberList;
