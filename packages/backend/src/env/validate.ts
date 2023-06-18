import { PORT_RULE } from '@my-task/common';
import { z } from 'zod';

const envSchema = z
  .object({
    BE_PORT: PORT_RULE,
    DB_PORT: PORT_RULE,
  })
  .refine(({ BE_PORT, DB_PORT }) => BE_PORT != DB_PORT, `백엔드 포트와 DB 포트의 값이 같습니다!`);

// 잘못된 환경 변수가 들어올 경우 반드시 Exception을 띄워야 함
export default envSchema.parse;
