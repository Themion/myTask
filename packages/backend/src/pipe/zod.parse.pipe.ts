import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodSchema, z } from 'zod';

export class ZodParsePipe<T extends ZodSchema> implements PipeTransform {
  constructor(private readonly schema: T) {}

  transform(value: any): z.infer<T> {
    const result = this.schema.safeParse(value);
    if (!result.success)
      throw new BadRequestException('Wrong DTO: try again!', { cause: result.error });
    return result.data as z.infer<T>;
  }
}
