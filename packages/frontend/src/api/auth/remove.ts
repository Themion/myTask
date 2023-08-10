import { RefreshedDTO } from '@my-task/common';
import { useMutation } from '@tanstack/react-query';
import { HttpMethod } from '~/constants';
import { MutationOptions } from '~/types';
import _fetch from '../core';

const removeAuth = (options: MutationOptions<RefreshedDTO>) =>
  useMutation({
    mutationKey: ['removeAuth'],
    mutationFn: () => _fetch('/auth', { method: HttpMethod.DELETE }),
    ...options,
  });

export default removeAuth;
