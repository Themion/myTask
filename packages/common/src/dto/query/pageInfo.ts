import { z } from 'zod';

const getPageInfoSchema = (limit: number = 10) =>
  z
    .object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).default(limit),
    })
    .transform((data) => ({
      offset: data.page,
      limit: data.limit,
    }));

type PageInfo = z.infer<ReturnType<typeof getPageInfoSchema>>;

export { getPageInfoSchema };
export type { PageInfo };
