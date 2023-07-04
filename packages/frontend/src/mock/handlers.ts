import { rest } from 'msw';
import { BE_ORIGIN } from '~/constants';

export const handlers = [
  rest.get(`${BE_ORIGIN}/`, (_, res, ctx) => res(ctx.status(200), ctx.json({ foo: 'bar' }))),
  rest.post(`${BE_ORIGIN}/`, async (req, res, ctx) => {
    const body = await req.json();
    return res(ctx.status(200), ctx.json(body));
  }),
];
