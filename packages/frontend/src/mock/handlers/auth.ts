import { confirmAuthDTOSchema, requestAuthDTOSchema } from '@my-task/common';
import { rest } from 'msw';
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

    if (data.uuid === '6aa6ee8e-a4f8-49f6-817f-1c9342aae29e')
      return res(ctx.status(400), ctx.json({ errorMessage: 'UUID cannot be found: Wrong DTO!' }));

    const success = { email: 'success@example.com' };

    return res(ctx.status(200), ctx.json(success));
  }),
];

export default authHandlers;
