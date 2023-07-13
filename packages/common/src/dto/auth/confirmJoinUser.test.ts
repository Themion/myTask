import { expect } from 'chai';
import { describe } from 'mocha';
import { v4 as uuidv4 } from 'uuid';
import { ZodIssueCode } from 'zod';
import { JsonObject } from '../../types';
import { confirmJoinUserDTO } from './confirmJoinUser';

describe('confirmJoinUserDTO', () => {
  let dto: JsonObject;

  beforeEach(() => {
    dto = { uuid: uuidv4() };
  });

  it('should work', () => {
    expect(() => confirmJoinUserDTO.parse(dto))
      .not.throw()
      .equal(dto);
  });

  describe('should throw error with', () => {
    it('no uuid field', () => {
      delete dto.uuid;
      expect(() => confirmJoinUserDTO.parse(dto)).throw(ZodIssueCode.invalid_type);
    });

    it('non-uuid string', () => {
      dto.uuid = 'invalid uuid';
      expect(() => confirmJoinUserDTO.parse(dto)).throw(ZodIssueCode.invalid_string);
    });

    it('invalid uuid', () => {
      dto.uuid = 'a2b68b19-asdf-asdf-zzzz-asdasdasdasd';
      expect(() => confirmJoinUserDTO.parse(dto)).throw(ZodIssueCode.invalid_string);
    });
  });
});
