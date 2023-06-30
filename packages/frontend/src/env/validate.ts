import { HOST_RULE, PORT_RULE } from '@my-task/common';
import { ZodIssueCode, z } from 'zod';

const envSchema = z
  .object({
    HOST: HOST_RULE,
    FE_PORT: PORT_RULE,
    BE_PORT: PORT_RULE,
  })
  .refine(({ FE_PORT, BE_PORT }) => FE_PORT != BE_PORT, ZodIssueCode.invalid_string);

// 잘못된 환경 변수가 들어올 경우 반드시 Exception을 띄워야 함
export default envSchema.parse;
