import { ZodIssueCode } from 'zod';
import validate from './validate';

describe('env validation', () => {
  let testEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    testEnv = {
      HOST: 'localhost',

      DB_PORT: '5432',
      DB_USER: 'a',
      DB_PASSWORD: 'a',
      DB_DB: 'a',

      REDIS_PORT: '6379',
      REDIS_USER: 'aa',
      REDIS_PASS: 'a',

      JWT_PUBLIC_KEY: 'a',
      JWT_PRIVATE_KEY: 'a',

      BE_PORT: '3000',

      EMAIL_HOST: 'smtp.gmail.com',
      EMAIL_PORT: '587',
      EMAIL_USER: 'a',
      EMAIL_PASS: 'a',
      EMAIL_SENDER: 'test@example.com',

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
        testEnv.HOST = 'localhost';
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
        expect(parsedEnv.DB.port).toEqual(parseInt(testEnv.DB_PORT as string));
      });
    });

    describe('should throw error when', () => {
      describe('type', () => {
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

        it('NETWORK.FE_PORT', () => {
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
        expect(parsedEnv.NETWORK.BE_PORT).toEqual(parseInt(testEnv.BE_PORT as string));
      });
    });

    describe('should throw error when', () => {
      describe('type', () => {
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

        it('NETWORK.FE_PORT', () => {
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

  describe('EMAIL_PORT', () => {
    const PORT_MIN = 0;
    const PORT_MAX = 65535;

    describe('should work with', () => {
      it(`${PORT_MIN} <= value <= ${PORT_MAX} (numeric number in range)`, () => {
        const parsedEnv = validate(testEnv);
        expect(parsedEnv.EMAIL.CONFIG.port).toEqual(parseInt(testEnv.EMAIL_PORT as string));
      });

      it('system port', () => {
        testEnv.EMAIL_PORT = '589';
        const parsedEnv = validate(testEnv);
        expect(parsedEnv.EMAIL.CONFIG.port).toEqual(parseInt(testEnv.EMAIL_PORT as string));
      });

      it('user port', () => {
        testEnv.EMAIL_PORT = '2525';
        const parsedEnv = validate(testEnv);
        expect(parsedEnv.EMAIL.CONFIG.port).toEqual(parseInt(testEnv.EMAIL_PORT as string));
      });
    });

    describe('should throw error when', () => {
      describe('type', () => {
        it('not-numeric string', () => {
          testEnv.EMAIL_PORT = 'non-numeric string';
          expect(() => validate(testEnv)).toThrow(ZodIssueCode.invalid_string);
        });
      });

      describe('value', () => {
        it('out of port range', () => {
          testEnv.EMAIL_PORT = '100000';
          expect(() => validate(testEnv)).toThrow(ZodIssueCode.too_big);
        });
      });
    });
  });

  describe('EMAIL.SENDER', () => {
    it('should work', () => {
      const parsedEnv = validate(testEnv);
      expect(parsedEnv.EMAIL.SENDER).toEqual(testEnv.EMAIL_SENDER);
    });

    describe('should throw error with', () => {
      it('empty field', () => {
        delete testEnv.EMAIL_SENDER;
        expect(() => validate(testEnv)).toThrow(ZodIssueCode.invalid_type);
      });

      it('invalid email', () => {
        testEnv.EMAIL_SENDER = 'invalid.email';
        expect(() => validate(testEnv)).toThrow(ZodIssueCode.invalid_string);
      });

      it('email with invalid domain', () => {
        testEnv.EMAIL_SENDER = 'invalid@email.';
        expect(() => validate(testEnv)).toThrow(ZodIssueCode.invalid_string);
      });

      it('email with invalid identifier', () => {
        testEnv.EMAIL_SENDER = '@invalid.email';
        expect(() => validate(testEnv)).toThrow(ZodIssueCode.invalid_string);
      });
    });
  });

  describe('NETWORK.FE_PORT', () => {
    describe('should work with', () => {
      it('should be numeric string', () => {
        const parsedEnv = validate(testEnv);
        expect(parsedEnv.NETWORK.FE_PORT).toEqual(parseInt(testEnv.FE_PORT as string));
      });
    });

    describe('should throw error when', () => {
      describe('type', () => {
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
