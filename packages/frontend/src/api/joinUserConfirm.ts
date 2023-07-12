import { CreateUserConfirmDTO, User } from '@my-task/common';
import { useMutation } from '@tanstack/react-query';
import { MutationOptions } from '~/types';
import fetchCore from './fetchCore';

const joinUserConfirm = (options: MutationOptions<User, CreateUserConfirmDTO>) =>
  useMutation({
    mutationFn: (body) => fetchCore('/auth/confirm', { method: 'POST', body }),
    ...options,
  });

export default joinUserConfirm;
