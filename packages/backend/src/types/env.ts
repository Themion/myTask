import { validate } from '~/env';

type Env = ReturnType<typeof validate>;
export default Env;
