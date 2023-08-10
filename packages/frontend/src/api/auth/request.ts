import { RequestAuthDTO } from '@my-task/common';
import { useMutation } from '@tanstack/react-query';
import { HttpMethod } from '~/constants';
import { MutationOptions } from '~/types';
import _fetch from '../core';

const requestAuth = (options: MutationOptions<RequestAuthDTO, RequestAuthDTO>) =>
  useMutation({
    mutationKey: ['requestAuth'],
    mutationFn: (body) => _fetch('/auth/request', { method: HttpMethod.POST, body }),
    ...options,
  });

export default requestAuth;
