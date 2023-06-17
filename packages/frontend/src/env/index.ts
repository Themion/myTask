import removePrefix from './removePrefix';
import validate from './validate';
const prefixRemovedEnv = removePrefix(import.meta.env);
export default validate(prefixRemovedEnv);
