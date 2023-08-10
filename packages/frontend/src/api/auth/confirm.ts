import { ConfirmAuthDTO } from '@my-task/common';
import { useMutation } from '@tanstack/react-query';
import { HttpMethod } from '~/constants';
import { MutationOptions } from '~/types';
import _fetch from '../core';

const confirmAuth = (options: MutationOptions<{ email: string }, ConfirmAuthDTO>) =>
  useMutation({
    mutationKey: ['confirmAuth'],
    mutationFn: (body) => _fetch('/auth/confirm', { method: HttpMethod.POST, body }),
    ...options,
  });

export default confirmAuth;
