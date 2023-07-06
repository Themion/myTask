import { useMutation } from '@tanstack/react-query';
import fetchCore from '~/api/fetchCore';

type Function = (...args: any[]) => any;
type MutationOption = {
  onSuccess?: Function;
  onError?: Function;
};

const postJoin = ({ onSuccess, onError }: MutationOption) =>
  useMutation({
    mutationFn: (body: Object) => fetchCore('/auth', { method: 'POST', body }),
    onSuccess,
    onError,
  });

export default postJoin;
