import { ZodError, ZodType } from 'zod';

const parseWithZod = <Output, Input = any>(data: any, zodSchema: ZodType<Output, any, Input>) =>
  zodSchema.safeParse(data) as {
    success: boolean;
    data?: ReturnType<(typeof zodSchema)['parse']>;
    error?: ZodError;
  };

export default parseWithZod;
