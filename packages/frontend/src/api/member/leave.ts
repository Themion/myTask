import { LeaveMemberDTO, Member } from '@my-task/common';
import { useMutation } from '@tanstack/react-query';
import { HttpMethod } from '~/constants';
import { MutationOptions } from '~/types';
import _fetch from '../core';

const leaveMember = (options: MutationOptions<Member, LeaveMemberDTO>) =>
  useMutation({
    mutationKey: ['leaveMember'],
    mutationFn: (body) => _fetch('/member', { method: HttpMethod.DELETE, body }),
    ...options,
  });

export default leaveMember;
