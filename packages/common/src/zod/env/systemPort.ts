import { z } from 'zod';
import PORT_RULE from './port';

const SYSTEM_PORT_MAX = 1023;

const SYSTEM_PORT_RULE = PORT_RULE.pipe(
  z
    .number()
    .max(SYSTEM_PORT_MAX, `시스템 포트 값은 반드시 ${SYSTEM_PORT_MAX + 1} 이하여야 합니다.`),
);

export default SYSTEM_PORT_RULE;
