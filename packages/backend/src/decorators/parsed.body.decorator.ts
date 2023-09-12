import { Body } from '@nestjs/common';
import { ZodSchema } from 'zod';
import { ZodParsePipe } from '~/pipe';

const ParsedBody = <T extends ZodSchema>(schema: T) => Body(new ZodParsePipe(schema));

export default ParsedBody;
