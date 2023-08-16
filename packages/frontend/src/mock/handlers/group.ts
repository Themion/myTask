import { GroupListDTO } from '@my-task/common';
import { rest } from 'msw';
import mockDir from './mockDir';

const mockGroupDir = (path: string) => mockDir(`/group${path}`);

const groupHandlers = [
  rest.get(mockGroupDir(''), async (_, res, ctx) => {
    ctx.delay();

    const group: GroupListDTO['group'] = [
      { id: 1, name: 'name1' },
      { id: 2, name: 'name2' },
      { id: 3, name: 'name3' },
    ];

    return res(ctx.status(200), ctx.json({ group }));
  }),
];

export default groupHandlers;
