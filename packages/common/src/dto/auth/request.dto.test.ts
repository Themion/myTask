import { expect } from 'chai';
import { describe } from 'mocha';
import { ZodIssueCode } from 'zod';
import { JsonObject } from '../../types';
import { RequestAuthDTO, requestAuthDTOSchema } from './request.dto';

describe('requestAuthDTOSchema', () => {
  let dto: JsonObject;

  beforeEach(() => {
    dto = { email: 'testing@example.com' };
  });

  it('should work', () => {
    expect(() => requestAuthDTOSchema.parse(dto))
      .not.throw()
      .equal(dto);
  });

  describe('should throw error with', () => {
    it('no email field', () => {
      delete dto.email;
      expect(() => requestAuthDTOSchema.parse(dto)).throw(ZodIssueCode.invalid_type);
    });

    it('invalid string', () => {
      dto.email = 'invalid.email';
      expect(() => requestAuthDTOSchema.parse(dto)).throw(ZodIssueCode.invalid_string);
    });

    it('email with invalid domain', () => {
      dto.email = 'invalid@email.';
      expect(() => requestAuthDTOSchema.parse(dto)).throw(ZodIssueCode.invalid_string);
    });

    it('email with invalid identifier', () => {
      dto.email = '@invalid.email';
      expect(() => requestAuthDTOSchema.parse(dto)).throw(ZodIssueCode.invalid_string);
    });
  });
});

describe('RequestAuthDTO', () => {
  let dto: JsonObject;

  beforeEach(() => {
    dto = { email: 'testing@example.com' };
  });

  it('should work', () => {
    const parsedDto: RequestAuthDTO = requestAuthDTOSchema.parse(dto);
    expect(parsedDto).deep.equal(dto);
  });
});
