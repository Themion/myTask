import { CreateUserConfirmDTO, User } from '@my-task/common';
import { useMutation } from '@tanstack/react-query';
import { MutationOptions } from '~/types';
import fetchCore from './fetchCore';

const joinUserConfirm = (options: MutationOptions) =>
  useMutation({
    mutationFn: (body: CreateUserConfirmDTO) =>
      fetchCore<User>('/auth/confirm', { method: 'POST', body }),
    ...options,
  });

export default joinUserConfirm;
