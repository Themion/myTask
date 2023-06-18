import { PORT_RULE } from '@my-task/common';
import { z } from 'zod';

const envSchema = z
  .object({
    FE_PORT: PORT_RULE,
    BE_PORT: PORT_RULE,
  })
  .refine(
    ({ FE_PORT, BE_PORT }) => FE_PORT != BE_PORT,
    `프론트엔드 포트와 백엔드 포트의 값이 같습니다!`,
  );

// 잘못된 환경 변수가 들어올 경우 반드시 Exception을 띄워야 함
export default envSchema.parse;
