import { JsonObject } from '@my-task/common';
import { useQuery } from '@tanstack/react-query';

type BackendError = {
  errorMessage: string;
  status: number;
};

type QueryOptions<Output extends JsonObject> = Parameters<
  typeof useQuery<unknown, BackendError, Output, string[]>
>[2];
export default QueryOptions;
