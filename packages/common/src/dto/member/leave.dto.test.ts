import { expect } from 'chai';
import { describe } from 'mocha';
import { ZodIssueCode } from 'zod';
import { JsonObject } from '../../types';
import { leaveMemberDTOSchema } from './leave.dto';

describe('leaveMemberDTOSchema', () => {
  let dto: JsonObject;

  beforeEach(() => {
    dto = { groupId: 1, email: 'test@email.com' };
  });

  it('should work', () => {
    expect(() => leaveMemberDTOSchema.parse(dto))
      .not.throw()
      .equal(dto);
  });

  describe('should throw error with', () => {
    it('no value', () => {
      delete dto.groupId;
      expect(() => leaveMemberDTOSchema.parse(dto)).throw(ZodIssueCode.invalid_type);
    });

    it('numeric string', () => {
      dto.groupId = '1';
      expect(() => leaveMemberDTOSchema.parse(dto)).throw(ZodIssueCode.invalid_type);
    });
  });
});
