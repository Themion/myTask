import { RequestSignUpDTO } from '@my-task/common';
import { useMutation } from '@tanstack/react-query';
import { MutationOptions } from '~/types';
import _fetch from './core';

const requestSignUp = (options: MutationOptions<RequestSignUpDTO, RequestSignUpDTO>) =>
  useMutation({
    mutationFn: (body) => _fetch('/auth/signup/syn', { method: 'POST', body }),
    ...options,
  });

export default requestSignUp;
