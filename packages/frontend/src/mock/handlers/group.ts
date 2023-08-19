import { GroupListDTO } from '@my-task/common';
import { rest } from 'msw';
import mockDir from './mockDir';

const mockGroupDir = (path: string) => mockDir(`/group${path}`);

const groupHandlers = [
  rest.get(mockGroupDir(''), async (req, res, ctx) => {
    ctx.delay();

    const params = req.url.searchParams;
    const page = parseInt(params.get('page') ?? '1');
    const limit = parseInt(params.get('limit') ?? '10');

    const groupArr: GroupListDTO['group'] = new Array(13)
      .fill(0)
      .map((_, i) => ({ id: i, name: `name${i}` }));

    const group = [...groupArr].slice((page - 1) * limit, page * limit);

    return res(ctx.status(200), ctx.json({ group, count: groupArr.length }));
  }),

  rest.post(mockGroupDir(''), async (req, res, ctx) => {
    ctx.delay();

    const body = await req.json();
    if (!body.name)
      return res(ctx.status(400), ctx.json({ errorMessage: 'Wrong DTO: try again!' }));

    const id = Math.floor(Math.random() * 10);
    const { name } = body;

    return res(ctx.status(200), ctx.json({ id, name }));
  }),
];

export default groupHandlers;
