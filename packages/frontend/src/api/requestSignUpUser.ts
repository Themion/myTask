import { RequestJoinUserDTO } from '@my-task/common';
import { useMutation } from '@tanstack/react-query';
import { MutationOptions } from '~/types';
import _fetch from './core';

const requestSignUpUser = (options: MutationOptions<RequestJoinUserDTO, RequestJoinUserDTO>) =>
  useMutation({
    mutationFn: (body) => _fetch('/auth/signup/syn', { method: 'POST', body }),
    ...options,
  });

export default requestSignUpUser;
