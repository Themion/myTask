import { RequestJoinUserDTO } from '@my-task/common';
import { useMutation } from '@tanstack/react-query';
import { MutationOptions } from '~/types';
import _fetch from './core';

const requestJoinUser = (options: MutationOptions<RequestJoinUserDTO, RequestJoinUserDTO>) =>
  useMutation({
    mutationFn: (body) => _fetch('/auth/join/syn', { method: 'POST', body }),
    ...options,
  });

export default requestJoinUser;
