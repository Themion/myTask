import { JsonObject } from '@my-task/common';
import { HttpMethod } from '~/constants';

type FetchOptions<BodyType extends JsonObject = JsonObject> = Partial<
  Pick<JsonObject, keyof Omit<RequestInit, 'body' | 'method'>> & {
    body: BodyType;
    method: (typeof HttpMethod)[keyof typeof HttpMethod];
  }
>;

export default FetchOptions;
