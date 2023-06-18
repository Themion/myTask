const PREFIX = 'VITE_';

const ifKeyHasPrefix = (key: string) => key.startsWith(PREFIX);
const removeKeyPrefix = (key: string) => key.replace(PREFIX, '');

const removePrefix = (env: NodeJS.ProcessEnv) =>
  Object.keys(env)
    .filter(ifKeyHasPrefix)
    .filter((key) => env[key])
    .reduce((acc, key) => ({ ...acc, [removeKeyPrefix(key)]: env[key] }), {} as NodeJS.ProcessEnv);

export default removePrefix;
