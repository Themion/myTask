import { rest } from 'msw';
import authHandlers from './auth';
import groupHandlers from './group';
import memberHandlers from './member';
import mockDir from './mockDir';

export const handlers = [
  rest.get(mockDir(''), (_, res, ctx) => res(ctx.status(200), ctx.json({ foo: 'bar' }))),
  rest.post(mockDir(''), async (req, res, ctx) => {
    const body = await req.json();
    return res(ctx.status(200), ctx.json(body));
  }),
  rest.get(mockDir('/error'), (_, res, ctx) =>
    res(ctx.status(400), ctx.json({ errorMessage: 'Error thrown for unknown reason.' })),
  ),

  ...authHandlers,
  ...groupHandlers,
  ...memberHandlers,
];
