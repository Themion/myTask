import env from '~/env';

const { HOST, BE_PORT } = env;
const BE_ORIGIN = `http://${HOST}:${BE_PORT}`;

export default BE_ORIGIN;
