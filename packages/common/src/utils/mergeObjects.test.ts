import { expect } from 'chai';
import { beforeEach, describe, it } from 'mocha';
import { JsonObject } from '../types';
import mergeObjects from './mergeObjects';

describe('mergeObjects', () => {
  let obj1: JsonObject, obj2: JsonObject;

  beforeEach(() => {
    obj1 = { a: 1, b: 2 };
    obj2 = { a: 1, c: 3 };
  });

  it('should work with plain objects', () => {
    const expectedResult = { a: 1, b: 2, c: 3 };
    expect(mergeObjects(obj1, obj2)).deep.equal(expectedResult);
  });

  describe('should override', () => {
    it('simple field of fallback object', () => {
      obj1 = { ...obj1, a: { d: 4, e: 5 } };
      const expectedResult = { a: { d: 4, e: 5 }, b: 2, c: 3 };
      expect(mergeObjects(obj1, obj2)).deep.equal(expectedResult);
    });

    it('object field of fallback object', () => {
      obj2 = { ...obj2, a: { d: 4, e: 5 } };
      const expectedResult = { a: 1, b: 2, c: 3 };
      expect(mergeObjects(obj1, obj2)).deep.equal(expectedResult);
    });
  });

  describe('should merge object field', () => {
    it('level 2', () => {
      obj1 = { ...obj1, a: { d: 4, e: 5 } };
      obj2 = { ...obj2, a: { d: 123, f: 6 } };
      const expectedResult = { a: { d: 4, e: 5, f: 6 }, b: 2, c: 3 };
      expect(mergeObjects(obj1, obj2)).deep.equal(expectedResult);
    });

    it('level 3', () => {
      obj1 = { ...obj1, a: { d: { f: 6, g: 7 }, e: 5 } };
      obj2 = { ...obj2, a: { d: { f: 1236, h: 8 }, i: 9 } };
      const expectedResult = { a: { d: { f: 6, g: 7, h: 8 }, e: 5, i: 9 }, b: 2, c: 3 };
      expect(mergeObjects(obj1, obj2)).deep.equal(expectedResult);
    });
  });

  it('should work with more than two objects', () => {
    const obj3 = { a: 1, d: 4 };
    const expectedResult = { a: 1, b: 2, c: 3, d: 4 };
    expect(mergeObjects(obj1, obj2, obj3)).deep.equal(expectedResult);
  });
});
