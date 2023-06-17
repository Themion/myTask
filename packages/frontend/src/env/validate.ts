import { z } from 'zod';

const SYSTEM_PORT_MAX = 1024;
const PORT_MAX = 65535;

const PORT_RULE = z
  .number()
  .min(SYSTEM_PORT_MAX, `${SYSTEM_PORT_MAX} 이하 포트는 시스템 포트입니다.`)
  .max(PORT_MAX, `포트 값은 반드시 ${PORT_MAX} 이하여야 합니다.`);

const envSchema = z
  .object({
    VITE_FE_PORT: z.string().transform(Number).pipe(PORT_RULE),
    VITE_BE_PORT: z.string().transform(Number).pipe(PORT_RULE),
  })
  .refine(
    ({ VITE_FE_PORT, VITE_BE_PORT }) => VITE_FE_PORT != VITE_BE_PORT,
    `프론트엔드 포트와 백엔드 포트의 값이 같습니다!`,
  );

// 잘못된 환경 변수가 들어올 경우 반드시 Exception을 띄워야 함
export default (env: ImportMetaEnv) => envSchema.parse(env);
