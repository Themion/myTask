import { ConfirmJoinUserDTO, User } from '@my-task/common';
import { useMutation } from '@tanstack/react-query';
import { MutationOptions } from '~/types';
import _fetch from './core';

const confirmSignUpUser = (options: MutationOptions<User, ConfirmJoinUserDTO>) =>
  useMutation({
    mutationFn: (body) => _fetch('/auth/signup/ack', { method: 'POST', body }),
    ...options,
  });

export default confirmSignUpUser;