import { rest } from 'msw';
import { BE_ORIGIN } from '~/constants';

export const handlers = [
  rest.get(`${BE_ORIGIN}/`, (_, res, ctx) => res(ctx.status(200), ctx.json({ foo: 'bar' }))),
];
