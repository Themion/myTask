import { JsonObject } from '@my-task/common';
import { BadRequestException } from '@nestjs/common';
import { ZodSchema, z } from 'zod';
import { ZodParsePipe } from './zod.parse.pipe';

describe('ZodParsePipe', () => {
  let schema: ZodSchema;
  let data: JsonObject;
  let pipe: ZodParsePipe<ZodSchema>;

  beforeEach(() => {
    schema = z.object({
      key1: z.number(),
      key2: z.string(),
    });
    pipe = new ZodParsePipe(schema);
  });

  it('should work', () => {
    data = { key1: 1, key2: 'asd', key3: false };

    const parsedData = pipe.transform(data);

    expect(parsedData).toBeDefined();
    expect(parsedData).not.toBeNull();
    expect(parsedData.key1).toEqual(data.key1);
    expect(parsedData.key2).toEqual(data.key2);
    expect(Object.keys(parsedData).length).toEqual(2);
  });

  describe('should throw error when', () => {
    it('without cetain field', () => {
      data = { key1: 1 };
      expect(() => pipe.transform(data)).toThrowError(BadRequestException);
    });

    it('field with wrong type', () => {
      data = { key1: 1, key2: 2 };
      expect(() => pipe.transform(data)).toThrowError(BadRequestException);
    });
  });
});
