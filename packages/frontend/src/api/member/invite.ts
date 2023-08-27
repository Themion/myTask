import { InviteMemberDTO, Member } from '@my-task/common';
import { useMutation } from '@tanstack/react-query';
import { HttpMethod } from '~/constants';
import { MutationOptions } from '~/types';
import _fetch from '../core';

const inviteMember = (options: MutationOptions<Member, InviteMemberDTO>) =>
  useMutation({
    mutationKey: ['inviteMember'],
    mutationFn: (body) => _fetch('/member', { method: HttpMethod.POST, body }),
    ...options,
  });

export default inviteMember;
