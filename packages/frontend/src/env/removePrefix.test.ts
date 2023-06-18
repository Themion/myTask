import { beforeEach, describe, expect, it } from 'vitest';
import removePrefix from '~/env/removePrefix';

describe('removePrefix', () => {
  let processEnv: NodeJS.ProcessEnv;
  const toEqualEnv: NodeJS.ProcessEnv = {
    BE_PORT: '3000',
    FE_PORT: '5173',
  };

  beforeEach(() => {
    processEnv = {
      VITE_BE_PORT: '3000',
      VITE_FE_PORT: '5173',
    };
  });

  it('should work', () => {
    const env = removePrefix(processEnv);
    expect(env).toEqual(toEqualEnv);
  });

  it('should ignore env without prefix', () => {
    processEnv.IGNORED = 'asdasd';
    const env = removePrefix(processEnv);
    expect(env).toEqual(toEqualEnv);
  });

  it('should ignore empty env', () => {
    processEnv.VITE_EMPTY_ENV = '';
    const env = removePrefix(processEnv);
    expect(env).toEqual(toEqualEnv);
  });
});
