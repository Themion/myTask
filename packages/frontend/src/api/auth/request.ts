import { RequestAuthDTO } from '@my-task/common';
import { useMutation } from '@tanstack/react-query';
import { MutationOptions } from '~/types';
import _fetch from '../core';

const requestAuth = (options: MutationOptions<RequestAuthDTO, RequestAuthDTO>) =>
  useMutation({
    mutationFn: (body) => _fetch('/auth/request', { method: 'POST', body }),
    ...options,
  });

export default requestAuth;
