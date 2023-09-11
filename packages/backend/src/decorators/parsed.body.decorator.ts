import { Body, createParamDecorator } from '@nestjs/common';
import { ZodSchema } from 'zod';
import { ZodParsePipe } from '~/pipe';

const ParsedBody = createParamDecorator(<T extends ZodSchema>(schema: T) =>
  Body(new ZodParsePipe(schema)),
);

export default ParsedBody;
