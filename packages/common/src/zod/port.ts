import { z } from 'zod';
import NUMERIC_STRING_RULE from './numericString';

const SYSTEM_PORT_MAX = 1024;
const PORT_MAX = 65535;

const PORT_RULE = NUMERIC_STRING_RULE.pipe(
  z
    .number()
    .min(SYSTEM_PORT_MAX, `${SYSTEM_PORT_MAX} 이하 포트는 시스템 포트입니다.`)
    .max(PORT_MAX, `포트 값은 반드시 ${PORT_MAX} 이하여야 합니다.`),
);

export default PORT_RULE;
