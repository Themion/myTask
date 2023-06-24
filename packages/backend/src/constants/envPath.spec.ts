import envPaths from '~/constants/envPath';

describe('envPath', () => {
  it('should have more than 2 paths', () => {
    expect(envPaths.length).toBeGreaterThanOrEqual(2);
  });

  it('should have only paths of .env', () => {
    const envPathRegExp = /\.env(.{0}|\.[a-z]+)$/;
    const length = envPaths.length;
    const pathsOfEnv = envPaths.filter((path) => envPathRegExp.test(path));
    expect(pathsOfEnv.length).toEqual(length);
  });

  it('should have no duplicate path', () => {
    const length = envPaths.length;
    const envPathSet = new Set(envPaths);
    expect(envPathSet.size).toEqual(length);
  });
});
