import { expect } from 'chai';
import { describe, it } from 'mocha';
import { getPageInfoSchema } from './pageInfo';

describe('getPageInfoSchema', () => {
  describe('should work when', () => {
    it('with no parameter', () => {
      expect(getPageInfoSchema().parse({})).deep.equal({ offset: 1, limit: 10 });
    });

    it('with page', () => {
      expect(getPageInfoSchema().parse({ page: '2' })).deep.equal({ offset: 2, limit: 10 });
    });

    it('with limit', () => {
      expect(getPageInfoSchema().parse({ limit: '30' })).deep.equal({ offset: 1, limit: 30 });
    });

    it('with page and limit', () => {
      expect(getPageInfoSchema().parse({ page: '2', limit: '30' })).deep.equal({
        offset: 2,
        limit: 30,
      });
    });
  });

  describe('should throw error when', () => {
    it('page or limit is defined and not numeric string', () => {
      expect(() => getPageInfoSchema().parse({ page: 1 })).throw();
      expect(() => getPageInfoSchema().parse({ page: true })).throw();
      expect(() => getPageInfoSchema().parse({ page: null })).throw();
      expect(() => getPageInfoSchema().parse({ page: 'null' })).throw();
      expect(() => getPageInfoSchema().parse({ limit: 30 })).throw();
      expect(() => getPageInfoSchema().parse({ limit: false })).throw();
      expect(() => getPageInfoSchema().parse({ limit: null })).throw();
      expect(() => getPageInfoSchema().parse({ limit: 'null' })).throw();
    });
  });
});
