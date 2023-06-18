import removePrefix from '~/env/removePrefix';
import validate from '~/env/validate';

const envPrefixRemoved = removePrefix(import.meta.env);
export default validate(envPrefixRemoved);
