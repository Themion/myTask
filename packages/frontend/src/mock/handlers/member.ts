import { MemberListDTO } from '@my-task/common';
import { rest } from 'msw';
import mockDir from './mockDir';

const mockMemberDir = (path: string) => mockDir(`/member${path}`);

const memberHandlers = [
  rest.get(mockMemberDir('/:groupId'), async (req, res, ctx) => {
    ctx.delay();

    const params = req.url.searchParams;
    const page = parseInt(params.get('page') ?? '1');
    const limit = parseInt(params.get('limit') ?? '30');

    const memberArr: MemberListDTO['member'] = new Array(33)
      .fill(0)
      .map((_, i) => ({ id: i, name: `name${i}`, email: `test${i}@email.com`, isManager: false }));

    const member = [...memberArr].slice((page - 1) * limit, page * limit);

    const dto: MemberListDTO = { member, count: memberArr.length };

    return res(ctx.status(200), ctx.json(dto));
  }),
];

export default memberHandlers;
