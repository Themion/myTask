import { ConfirmSignUpDTO, User } from '@my-task/common';
import { useMutation } from '@tanstack/react-query';
import { MutationOptions } from '~/types';
import _fetch from './core';

const confirmSignIn = (options: MutationOptions<User, ConfirmSignUpDTO>) =>
  useMutation({
    mutationFn: (body) => _fetch('/auth/signin/ack', { method: 'POST', body }),
    ...options,
  });

export default confirmSignIn;