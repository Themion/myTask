import env from '~/env';

const { BE_HOST, BE_PORT } = env;
const BE_ORIGIN = `http://${BE_HOST}:${BE_PORT}`;

export default BE_ORIGIN;
