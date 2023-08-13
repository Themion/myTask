import { confirmAuthDTOSchema, requestAuthDTOSchema } from '@my-task/common';
import { rest } from 'msw';
import { invalidUUID, validEmail } from '../constants';
import mockDir from './mockDir';

const mockAuthDir = (path: string) => mockDir(`/auth${path}`);

const authHandlers = [
  rest.post(mockAuthDir('/request'), async (req, res, ctx) => {
    const body = await req.json();

    ctx.delay();

    const result = requestAuthDTOSchema.safeParse(body);
    if (!result.success)
      return res(ctx.status(400), ctx.json({ errorMessage: 'Wrong DTO: try again!' }));
    const { data } = result;

    return res(ctx.status(200), ctx.json(data));
  }),

  rest.post(mockAuthDir('/confirm'), async (req, res, ctx) => {
    const body = await req.json();

    ctx.delay();

    const result = confirmAuthDTOSchema.safeParse(body);
    if (!result.success)
      return res(ctx.status(400), ctx.json({ errorMessage: 'Wrong DTO: try again!' }));
    const { data } = result;

    if (data.uuid === invalidUUID)
      return res(ctx.status(400), ctx.json({ errorMessage: 'UUID cannot be found: Wrong DTO!' }));

    const success = { email: validEmail };

    return res(ctx.status(200), ctx.json(success));
  }),

  rest.delete(mockAuthDir(''), async (_, res, ctx) => {
    ctx.delay();
    // cannot mock cookie from react query
    return res(ctx.status(200), ctx.json({ refreshed: false }));
  }),
];

export default authHandlers;
