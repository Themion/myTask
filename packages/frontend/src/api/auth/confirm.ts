import { ConfirmAuthDTO } from '@my-task/common';
import { useMutation } from '@tanstack/react-query';
import { MutationOptions } from '~/types';
import _fetch from '../core';

const confirmAuth = (options: MutationOptions<{ email: string }, ConfirmAuthDTO>) =>
  useMutation({
    mutationFn: (body) => _fetch('/auth/confirm', { method: 'POST', body }),
    ...options,
  });

export default confirmAuth;
