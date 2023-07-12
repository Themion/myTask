import { z } from 'zod';
import PORT_RULE from './port';

const USER_PORT_MIN = 1024;

const USER_PORT_RULE = PORT_RULE.pipe(
  z.number().min(USER_PORT_MIN, `사용자 포트 값은 반드시 ${USER_PORT_MIN + 1} 이상이어야 합니다.`),
);

export default USER_PORT_RULE;
