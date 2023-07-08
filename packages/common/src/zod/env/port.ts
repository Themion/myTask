import { z } from 'zod';
import NUMERIC_STRING_RULE from './numericString';

const PORT_MIN = 0;
const PORT_MAX = 65535;

const PORT_RULE = NUMERIC_STRING_RULE.pipe(
  z
    .number()
    .int()
    .min(PORT_MIN, `포트 값은 반드시 ${PORT_MIN} 이상이어야 합니다.`)
    .max(PORT_MAX, `포트 값은 반드시 ${PORT_MAX} 이하여야 합니다.`),
);

export default PORT_RULE;
