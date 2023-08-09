import { JsonObject, mergeObjects } from '@my-task/common';
import { BE_ORIGIN, DEFAULT_FETCH_OPTIONS } from '~/constants';

type RequestOption<BodyType extends JsonObject> = Partial<Pick<JsonObject, keyof RequestInit>> & {
  body?: BodyType;
};

type BodyObject = { body: string } | {};

const getBody = <Input extends JsonObject>({ body }: RequestOption<Input>): BodyObject =>
  body ? { body: JSON.stringify(body) } : {};

const _fetch = async <Output = any, Input extends JsonObject = JsonObject>(
  path: string,
  option: RequestOption<Input> = {},
) => {
  const url = new URL(path, BE_ORIGIN);

  const fetchOption = mergeObjects(getBody(option), option, DEFAULT_FETCH_OPTIONS) as RequestInit;

  const res = await fetch(url.href, fetchOption);
  const data = await res.json();

  if (!res.ok) throw { ...data, status: res.status };
  return data as Output;
};

export default _fetch;
