import { User, confirmJoinUserDTO, requestJoinUserDTO } from '@my-task/common';
import { rest } from 'msw';
import { BE_ORIGIN } from '~/constants';

const mockDir = (path: string) => `${BE_ORIGIN}${path}`;

export const handlers = [
  rest.get(mockDir(''), (_, res, ctx) => res(ctx.status(200), ctx.json({ foo: 'bar' }))),
  rest.post(mockDir(''), async (req, res, ctx) => {
    const body = await req.json();
    return res(ctx.status(200), ctx.json(body));
  }),
  rest.get(`${BE_ORIGIN}/error`, (_, res, ctx) =>
    res(ctx.status(400), ctx.json({ errorMessage: 'Error thrown for unknown reason.' })),
  ),

  rest.post(mockDir('/auth/signup/syn'), async (req, res, ctx) => {
    const body = await req.json();

    ctx.delay();

    const result = requestJoinUserDTO.safeParse(body);
    if (!result.success)
      return res(ctx.status(400), ctx.json({ errorMessage: 'Wrong DTO: try again!' }));
    const { data } = result;

    return res(ctx.status(200), ctx.json(data));
  }),

  rest.post(mockDir('/auth/signup/ack'), async (req, res, ctx) => {
    const body = await req.json();

    ctx.delay();

    const result = confirmJoinUserDTO.safeParse(body);
    if (!result.success)
      return res(ctx.status(400), ctx.json({ errorMessage: 'Wrong DTO: try again!' }));
    const { data } = result;

    if (data.uuid === '6aa6ee8e-a4f8-49f6-817f-1c9342aae29e')
      return res(ctx.status(400), ctx.json({ errorMessage: 'UUID cannot be found: Wrong DTO!' }));

    const id = Math.floor(Math.random() * 10);
    const success: User = { id, email: 'success@example.com' };

    return res(ctx.status(200), ctx.json(success));
  }),
];
