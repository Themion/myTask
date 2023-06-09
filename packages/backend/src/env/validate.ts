import { HOST_RULE, PORT_RULE, USER_PORT_RULE } from '@my-task/common';
import { ZodIssueCode, z } from 'zod';

const envSchema = z
  .object({
    HOST: HOST_RULE,

    DB_PORT: USER_PORT_RULE,
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_DB: z.string(),

    BE_PORT: USER_PORT_RULE,

    EMAIL_HOST: z.string(),
    EMAIL_PORT: PORT_RULE,
    EMAIL_USER: z.string(),
    EMAIL_PASS: z.string(),

    EMAIL_SENDER: z.string().email(),

    FE_PORT: USER_PORT_RULE,
  })
  .refine(({ BE_PORT, DB_PORT }) => BE_PORT !== DB_PORT, ZodIssueCode.invalid_string)
  .refine(({ BE_PORT, FE_PORT }) => BE_PORT !== FE_PORT, ZodIssueCode.invalid_string)
  .refine(({ FE_PORT, DB_PORT }) => FE_PORT !== DB_PORT, ZodIssueCode.invalid_string);

// 잘못된 환경 변수가 들어올 경우 반드시 Exception을 띄워야 함
export default envSchema.parse;
