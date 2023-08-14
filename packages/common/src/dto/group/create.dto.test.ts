import { expect } from 'chai';
import { describe } from 'mocha';
import { ZodIssueCode } from 'zod';
import { createGroupDTOSchema } from './create.dto';

describe('createGroupDTOSchema', () => {
  describe('should work with', () => {
    it('should work', () => {
      const dto = { name: 'name' };
      expect(() => createGroupDTOSchema.parse(dto))
        .not.throw()
        .equal(dto);
    });

    it('empty name', () => {
      const dto = { name: '' };
      expect(() => createGroupDTOSchema.parse(dto))
        .not.throw()
        .equal(dto);
    });
  });

  describe('should throw error with', () => {
    it('no name name', () => {
      expect(() => createGroupDTOSchema.parse({})).throw(ZodIssueCode.invalid_type);
    });
  });
});
