import { RequestJoinUserDTO } from '@my-task/common';
import { useMutation } from '@tanstack/react-query';
import { MutationOptions } from '~/types';
import fetchCore from './fetchCore';

const requestJoinUser = (options: MutationOptions<RequestJoinUserDTO, RequestJoinUserDTO>) =>
  useMutation({
    mutationFn: (body) => fetchCore('/auth/join/syn', { method: 'POST', body }),
    ...options,
  });

export default requestJoinUser;
