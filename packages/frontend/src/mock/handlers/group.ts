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

    const group: GroupListDTO['group'] = new Array(13)
      .fill(0)
      .map((_, i) => ({ id: i, name: `name${i}` }))
      .slice((page - 1) * limit, page * limit);

    return res(ctx.status(200), ctx.json({ group }));
  }),
];

export default groupHandlers;
