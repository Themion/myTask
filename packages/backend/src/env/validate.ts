import { EMAIL_RULE, HOST_RULE, PORT_RULE, STRING_RULE, USER_PORT_RULE } from '@my-task/common';
import { ZodIssueCode, z } from 'zod';

const envSchema = z
  .object({
    HOST: HOST_RULE,

    DB_PORT: USER_PORT_RULE,
    DB_USER: STRING_RULE,
    DB_PASSWORD: STRING_RULE,
    DB_DB: STRING_RULE,

    REDIS_PORT: USER_PORT_RULE,
    REDIS_USER: STRING_RULE,
    REDIS_PASS: STRING_RULE,

    JWT_PUBLIC_KEY: STRING_RULE,
    JWT_PRIVATE_KEY: STRING_RULE,

    BE_PORT: USER_PORT_RULE,

    EMAIL_HOST: STRING_RULE,
    EMAIL_PORT: PORT_RULE,
    EMAIL_USER: STRING_RULE,
    EMAIL_PASS: STRING_RULE,
    EMAIL_SENDER: EMAIL_RULE,

    FE_PORT: USER_PORT_RULE,
  })
  .refine(({ BE_PORT, DB_PORT }) => BE_PORT !== DB_PORT, ZodIssueCode.invalid_string)
  .refine(({ BE_PORT, FE_PORT }) => BE_PORT !== FE_PORT, ZodIssueCode.invalid_string)
  .refine(({ FE_PORT, DB_PORT }) => FE_PORT !== DB_PORT, ZodIssueCode.invalid_string)
  .transform((env) => ({
    DB: {
      host: env.HOST,
      port: env.DB_PORT,
      database: env.DB_DB,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
    },
    EMAIL: {
      CONFIG: {
        host: env.EMAIL_HOST,
        port: env.EMAIL_PORT,
        auth: {
          user: env.EMAIL_USER,
          pass: env.EMAIL_PASS,
        },
      },
      SENDER: env.EMAIL_SENDER,
    },
    NETWORK: {
      HOST: env.HOST,
      BE_PORT: env.BE_PORT,
      FE_PORT: env.FE_PORT,
    },
    JWT: {
      publicKey: env.JWT_PUBLIC_KEY,
      privateKey: env.JWT_PRIVATE_KEY,
    },
    REDIS: {
      socket: {
        host: env.HOST,
        port: env.REDIS_PORT,
      },
      username: env.REDIS_USER,
      password: env.REDIS_PASS,
    },
    NODE_ENV: process.env.NODE_ENV,
  }));

// 잘못된 환경 변수가 들어올 경우 반드시 Exception을 띄워야 함
export default envSchema.parse;
