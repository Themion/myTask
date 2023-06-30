import { ZodIssueCode } from 'zod';
import { Env } from '~/types';
import validate from './validate';

describe('env validation', () => {
  let testEnv: { [key in keyof Env]: any };

  beforeEach(() => {
    testEnv = {
      HOST: 'localhost',

      DB_PORT: '5432',
      DB_USER: '',
      DB_PASSWORD: '',
      DB_DB: '',

      BE_PORT: '3000',

      FE_PORT: '5173',
    };
  });

  describe('HOST', () => {
    const v4 = 256;
    const randint = (val: number = 1) => Math.floor(Math.random() * Math.floor(val));

    describe('should work with', () => {
      it('ipv4', () => {
        testEnv.HOST = `${randint(v4 - 1) + 1}.${randint(v4)}.${randint(v4)}.${randint(v4)}`;
        expect(() => validate(testEnv)).not.toThrow();
      });

      it('localhost', () => {
        expect(() => validate(testEnv)).not.toThrow();
      });

      it('docker host', () => {
        testEnv.HOST = 'host.docker.internal';
        expect(() => validate(testEnv)).not.toThrow();
      });
    });

    describe('should throw error when', () => {
      describe('value', () => {
        it('ipv4 starting with 0', () => {
          testEnv.HOST = `0.${randint(v4)}.${randint(v4)}.${randint(v4)}`;
          expect(() => validate(testEnv)).toThrowError(ZodIssueCode.invalid_string);
        });
      });
    });
  });

  describe('DB_PORT', () => {
    describe('should work with', () => {
      it('should be numeric string', () => {
        const parsedEnv = validate(testEnv);
        expect(parsedEnv.DB_PORT).toEqual(parseInt(testEnv.DB_PORT));
      });
    });

    describe('should throw error when', () => {
      describe('type', () => {
        it('number', () => {
          testEnv.DB_PORT = 3000;
          expect(() => validate(testEnv)).toThrow(ZodIssueCode.invalid_type);
        });

        it('not-numeric string', () => {
          testEnv.DB_PORT = 'non-numeric string';
          expect(() => validate(testEnv)).toThrow(ZodIssueCode.invalid_string);
        });
      });

      describe('value', () => {
        it('in system port range', () => {
          testEnv.DB_PORT = '1000';
          expect(() => validate(testEnv)).toThrow(ZodIssueCode.too_small);
        });

        it('bigger than max port', () => {
          testEnv.DB_PORT = '100000';
          expect(() => validate(testEnv)).toThrow(ZodIssueCode.too_big);
        });

        it('FE_PORT', () => {
          testEnv.DB_PORT = testEnv.FE_PORT;
          expect(() => validate(testEnv)).toThrow(ZodIssueCode.invalid_string);
        });

        it('BE_PORT', () => {
          testEnv.DB_PORT = testEnv.BE_PORT;
          expect(() => validate(testEnv)).toThrow(ZodIssueCode.invalid_string);
        });
      });
    });
  });

  describe('BE_PORT', () => {
    describe('should work with', () => {
      it('should be numeric string', () => {
        const parsedEnv = validate(testEnv);
        expect(parsedEnv.BE_PORT).toEqual(parseInt(testEnv.BE_PORT));
      });
    });

    describe('should throw error when', () => {
      describe('type', () => {
        it('number', () => {
          testEnv.BE_PORT = 3000;
          expect(() => validate(testEnv)).toThrow(ZodIssueCode.invalid_type);
        });

        it('not-numeric string', () => {
          testEnv.BE_PORT = 'non-numeric string';
          expect(() => validate(testEnv)).toThrow(ZodIssueCode.invalid_string);
        });
      });

      describe('value', () => {
        it('in system port range', () => {
          testEnv.BE_PORT = '1000';
          expect(() => validate(testEnv)).toThrow(ZodIssueCode.too_small);
        });

        it('bigger than max port', () => {
          testEnv.BE_PORT = '100000';
          expect(() => validate(testEnv)).toThrow(ZodIssueCode.too_big);
        });

        it('FE_PORT', () => {
          testEnv.BE_PORT = testEnv.FE_PORT;
          expect(() => validate(testEnv)).toThrow(ZodIssueCode.invalid_string);
        });

        it('DB_PORT', () => {
          testEnv.BE_PORT = testEnv.DB_PORT;
          expect(() => validate(testEnv)).toThrow(ZodIssueCode.invalid_string);
        });
      });
    });
  });

  describe('FE_PORT', () => {
    describe('should work with', () => {
      it('should be numeric string', () => {
        const parsedEnv = validate(testEnv);
        expect(parsedEnv.FE_PORT).toEqual(parseInt(testEnv.FE_PORT));
      });
    });

    describe('should throw error when', () => {
      describe('type', () => {
        it('number', () => {
          testEnv.FE_PORT = 5173;
          expect(() => validate(testEnv)).toThrow(ZodIssueCode.invalid_type);
        });

        it('not-numeric string', () => {
          testEnv.FE_PORT = 'non-numeric string';
          expect(() => validate(testEnv)).toThrow(ZodIssueCode.invalid_string);
        });
      });

      describe('value', () => {
        it('in system port range', () => {
          testEnv.FE_PORT = '1000';
          expect(() => validate(testEnv)).toThrow(ZodIssueCode.too_small);
        });

        it('bigger than max port', () => {
          testEnv.FE_PORT = '100000';
          expect(() => validate(testEnv)).toThrow(ZodIssueCode.too_big);
        });

        it('BE_PORT', () => {
          testEnv.FE_PORT = testEnv.BE_PORT;
          expect(() => validate(testEnv)).toThrow(ZodIssueCode.invalid_string);
        });

        it('DB_PORT', () => {
          testEnv.FE_PORT = testEnv.DB_PORT;
          expect(() => validate(testEnv)).toThrow(ZodIssueCode.invalid_string);
        });
      });
    });
  });
});
