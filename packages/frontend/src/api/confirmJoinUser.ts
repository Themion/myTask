import { CreateUserConfirmDTO, User } from '@my-task/common';
import { useMutation } from '@tanstack/react-query';
import { MutationOptions } from '~/types';
import fetchCore from './fetchCore';

const confirmJoinUser = (options: MutationOptions<User, CreateUserConfirmDTO>) =>
  useMutation({
    mutationFn: (body) => fetchCore('/auth/join/ack', { method: 'POST', body }),
    ...options,
  });

export default confirmJoinUser;
