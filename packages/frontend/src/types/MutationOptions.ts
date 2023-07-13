import { JsonObject } from '@my-task/common';
import { useMutation } from '@tanstack/react-query';

type BackendError = {
  errorMessage: string;
  status: number;
};

type MutationOptions<Output extends JsonObject, Input extends JsonObject = JsonObject> = Parameters<
  typeof useMutation<Output, BackendError, Input, unknown>
>[2];
export default MutationOptions;
