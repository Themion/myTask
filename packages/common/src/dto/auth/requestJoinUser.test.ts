import { expect } from 'chai';
import { describe } from 'mocha';
import { ZodIssueCode } from 'zod';
import { JsonObject } from '../../types';
import { RequestJoinUserDTO, requestJoinUserDTO } from './requestJoinUser';

describe('requestJoinUserDTO', () => {
  let dto: JsonObject;

  beforeEach(() => {
    dto = { email: 'testing@example.com' };
  });

  it('should work', () => {
    expect(() => requestJoinUserDTO.parse(dto))
      .not.throw()
      .equal(dto);
  });

  describe('should throw error with', () => {
    it('no email field', () => {
      delete dto.email;
      expect(() => requestJoinUserDTO.parse(dto)).throw(ZodIssueCode.invalid_type);
    });

    it('invalid string', () => {
      dto.email = 'invalid.email';
      expect(() => requestJoinUserDTO.parse(dto)).throw(ZodIssueCode.invalid_string);
    });

    it('email with invalid domain', () => {
      dto.email = 'invalid@email.';
      expect(() => requestJoinUserDTO.parse(dto)).throw(ZodIssueCode.invalid_string);
    });

    it('email with invalid identifier', () => {
      dto.email = '@invalid.email';
      expect(() => requestJoinUserDTO.parse(dto)).throw(ZodIssueCode.invalid_string);
    });
  });
});

describe('RequestJoinUserDTO', () => {
  let dto: JsonObject;

  beforeEach(() => {
    dto = { email: 'testing@example.com' };
  });

  it('should work', () => {
    const parsedDto: RequestJoinUserDTO = requestJoinUserDTO.parse(dto);
    expect(parsedDto).deep.equal(dto);
  });
});
