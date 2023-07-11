import { expect } from 'chai';
import { describe } from 'mocha';
import { v4 as uuidv4 } from 'uuid';
import { ZodIssueCode } from 'zod';
import { JsonObject } from '../../../types';
import { createUserConfirmDTO } from './createUserConfirm';

describe('createUserConfirmDTO', () => {
  let dto: JsonObject;

  beforeEach(() => {
    dto = { uuid: uuidv4() };
  });

  it('should work', () => {
    expect(() => createUserConfirmDTO.parse(dto))
      .not.throw()
      .equal(dto);
  });

  describe('should throw error with', () => {
    it('no uuid field', () => {
      delete dto.uuid;
      expect(() => createUserConfirmDTO.parse(dto)).throw(ZodIssueCode.invalid_type);
    });

    it('non-uuid string', () => {
      dto.uuid = 'invalid uuid';
      expect(() => createUserConfirmDTO.parse(dto)).throw(ZodIssueCode.invalid_string);
    });

    it('invalid uuid', () => {
      dto.uuid = 'a2b68b19-asdf-asdf-zzzz-asdasdasdasd';
      expect(() => createUserConfirmDTO.parse(dto)).throw(ZodIssueCode.invalid_string);
    });
  });
});
