import { Group, User } from '@my-task/common';

type PageInfo = {
  offset: number;
  limit: number;
};

const mockGroupService = async () => ({
  groups: new Map<string, Group[]>(),

  async createGroup(creator: User, name: string) {
    const id = Math.floor(Math.random() * 10);
    const group: Group = { id, name };
    this.groups.set(creator.email, (this.groups.get(creator.email) || []).concat([group]));
    return group;
  },

  async createGroupByEmail(email: string, name: string) {
    const id = Math.floor(Math.random() * 10);
    const group: Group = { id, name };
    this.groups.set(email, (this.groups.get(email) || []).concat([group]));
    return group;
  },

  async findGroupByEmail(email: string, options: Partial<PageInfo> = {}) {
    const { offset, limit } = {
      offset: 1,
      limit: 10,
      ...options,
    } as PageInfo;

    const start = (offset - 1) * limit;

    const arr = this.groups.get(email) ?? [];
    const group = [...arr].slice(start, start + limit);
    return { group, count: arr.length };
  },
});

type MockGroupService = Awaited<ReturnType<typeof mockGroupService>>;

export { mockGroupService };
export type { MockGroupService };
