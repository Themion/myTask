import { beforeEach, describe, expect, it } from 'vitest';
import removePrefix from './removePrefix';

describe('Removing env prefix', () => {
  let testEnv: any;

  beforeEach(() => {
    testEnv = {
      VITE_FE_PORT: '5173',
    };
  });

  it('should work', () => {
    const prefixRemovedEnd = removePrefix(testEnv);
    expect(prefixRemovedEnd).toEqual({ FE_PORT: testEnv.VITE_FE_PORT });
  });

  it('should ignore key without prefix', () => {
    testEnv.FE_PORT = testEnv.VITE_FE_PORT;
    const prefixRemovedEnd = removePrefix(testEnv);
    expect(prefixRemovedEnd).toEqual({ FE_PORT: testEnv.VITE_FE_PORT });
  });

  it('should ignore empty value', () => {
    testEnv.VITE_FE_PORT = '';
    const prefixRemovedEnd = removePrefix(testEnv);
    expect(prefixRemovedEnd).toEqual({});
  });
});
