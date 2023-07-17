import { expect } from 'chai';
import { describe } from 'mocha';
import { ZodIssueCode } from 'zod';
import { JsonObject } from '../../../types';
import { requestSignInDTOSchema } from './requestSignIn.dto';

describe('requestSignInDTOSchema', () => {
  let dto: JsonObject;

  beforeEach(() => {
    dto = { email: 'testing@example.com' };
  });

  it('should work', () => {
    expect(() => requestSignInDTOSchema.parse(dto))
      .not.throw()
      .equal(dto);
  });

  describe('should throw error with', () => {
    it('no email field', () => {
      delete dto.email;
      expect(() => requestSignInDTOSchema.parse(dto)).throw(ZodIssueCode.invalid_type);
    });

    it('invalid string', () => {
      dto.email = 'invalid.email';
      expect(() => requestSignInDTOSchema.parse(dto)).throw(ZodIssueCode.invalid_string);
    });

    it('email with invalid domain', () => {
      dto.email = 'invalid@email.';
      expect(() => requestSignInDTOSchema.parse(dto)).throw(ZodIssueCode.invalid_string);
    });

    it('email with invalid identifier', () => {
      dto.email = '@invalid.email';
      expect(() => requestSignInDTOSchema.parse(dto)).throw(ZodIssueCode.invalid_string);
    });
  });
});
