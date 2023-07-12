import { CreateUserDTO } from '@my-task/common';
import { useMutation } from '@tanstack/react-query';
import { MutationOptions } from '~/types';
import fetchCore from './fetchCore';

const postJoin = (options: MutationOptions) =>
  useMutation({
    mutationFn: (body: CreateUserDTO) =>
      fetchCore<CreateUserDTO>('/auth', { method: 'POST', body }),
    ...options,
  });

export default postJoin;
