import { RequestSignInDTO } from '@my-task/common';
import { useMutation } from '@tanstack/react-query';
import { MutationOptions } from '~/types';
import _fetch from './core';

const requestSignIn = (options: MutationOptions<RequestSignInDTO, RequestSignInDTO>) =>
  useMutation({
    mutationFn: (body) => _fetch('/auth/signin/syn', { method: 'POST', body }),
    ...options,
  });

export default requestSignIn;
