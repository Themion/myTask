import { expect } from 'chai';
import { describe } from 'mocha';
import { ZodIssueCode } from 'zod';
import { JsonObject } from '../../types';
import { groupInfoDTOSchema } from './info.dto';

describe('createGroupDTOSchema', () => {
  let dto: JsonObject;

  beforeEach(() => {
    dto = { id: 1, name: 'name' };
  });

  it('should work', () => {
    expect(() => groupInfoDTOSchema.parse(dto))
      .not.throw()
      .equal(dto);
  });

  describe('should throw error with', () => {
    it('no id', () => {
      delete dto.name;
      expect(() => groupInfoDTOSchema.parse(dto)).throw(ZodIssueCode.invalid_type);
    });

    it('no name', () => {
      delete dto.name;
      expect(() => groupInfoDTOSchema.parse(dto)).throw(ZodIssueCode.invalid_type);
    });

    it('empty name', () => {
      dto.name = '';
      expect(() => groupInfoDTOSchema.parse(dto)).throw(ZodIssueCode.too_small);
    });
  });
});
