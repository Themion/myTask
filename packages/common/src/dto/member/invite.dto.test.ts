import { expect } from 'chai';
import { describe } from 'mocha';
import { ZodIssueCode } from 'zod';
import { JsonObject } from '../../types';
import { inviteMemberDTOSchema } from './invite.dto';

describe('inviteMemberDTOSchema', () => {
  let dto: JsonObject;

  beforeEach(() => {
    dto = { groupId: 1, email: 'test@email.com' };
  });

  it('should work', () => {
    expect(() => inviteMemberDTOSchema.parse(dto))
      .not.throw()
      .equal(dto);
  });

  describe('should throw error with', () => {
    describe('groupId', () => {
      it('no value', () => {
        delete dto.groupId;
        expect(() => inviteMemberDTOSchema.parse(dto)).throw(ZodIssueCode.invalid_type);
      });

      it('numeric string', () => {
        dto.groupId = '1';
        expect(() => inviteMemberDTOSchema.parse(dto)).throw(ZodIssueCode.invalid_type);
      });
    });

    describe('email', () => {
      it('no email field', () => {
        delete dto.email;
        expect(() => inviteMemberDTOSchema.parse(dto)).throw(ZodIssueCode.invalid_type);
      });

      it('non-email', () => {
        dto.email = 'asdasd';
        expect(() => inviteMemberDTOSchema.parse(dto)).throw(ZodIssueCode.invalid_string);
      });
    });
  });
});
