const PREFIX = 'VITE_';

const ifKeyHasPrefix = (key: string) => key.indexOf(PREFIX) === 0;
const removeKeyPrefix = (key: string) => key.substring(PREFIX.length);

const removePrefix = (env: NodeJS.ProcessEnv) =>
  Object.keys(env)
    .filter(ifKeyHasPrefix)
    .filter((key) => env[key])
    .reduce(
      (acc, key) => ({
        ...acc,
        [removeKeyPrefix(key)]: env[key],
      }),
      {} as NodeJS.ProcessEnv,
    );

export default removePrefix;
