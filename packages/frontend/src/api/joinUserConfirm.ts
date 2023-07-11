import { CreateUserConfirmDTO, User } from '@my-task/common';
import { useMutation } from '@tanstack/react-query';
import fetchCore from './fetchCore';

type Function = (...args: any[]) => any;
type MutationOption = {
  onSuccess?: Function;
  onError?: Function;
};

const joinUserConfirm = ({ onSuccess, onError }: MutationOption) =>
  useMutation({
    mutationFn: (body: CreateUserConfirmDTO) =>
      fetchCore<User>('/auth/confirm', { method: 'POST', body }),
    onSuccess,
    onError,
  });

export default joinUserConfirm;
