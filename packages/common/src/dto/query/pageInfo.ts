import { z } from 'zod';
import { NUMERIC_STRING_RULE } from '../../utils';

const getPageInfoSchema = (limit: number = 10) =>
  z
    .object({
      page: NUMERIC_STRING_RULE.default('1'),
      limit: NUMERIC_STRING_RULE.default(`${limit}`),
    })
    .transform((data) => ({
      offset: data.page,
      limit: data.limit,
    }));

type PageInfo = z.infer<ReturnType<typeof getPageInfoSchema>>;

export { getPageInfoSchema };
export type { PageInfo };
