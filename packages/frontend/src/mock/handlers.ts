import { createUserDTO, parseWithZod } from '@my-task/common';
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

  rest.post(mockDir('/auth'), async (req, res, ctx) => {
    const body = await req.json();

    ctx.delay();

    const { data, error } = parseWithZod(body, createUserDTO);

    if (error) return res(ctx.status(400), ctx.json({ errorMessage: 'Wrong DTO: try again!' }));
    return res(ctx.status(200), ctx.json(data));
  }),
];
