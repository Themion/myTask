import { CreateUserDTO } from '@my-task/common';
import { useMutation } from '@tanstack/react-query';
import { MutationOptions } from '~/types';
import fetchCore from './fetchCore';

const postJoin = (options: MutationOptions<CreateUserDTO, CreateUserDTO>) =>
  useMutation({
    mutationFn: (body) => fetchCore('/auth', { method: 'POST', body }),
    ...options,
  });

export default postJoin;
