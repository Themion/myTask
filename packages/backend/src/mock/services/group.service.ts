import { Group, User } from '@my-task/common';

type PageInfo = {
  offset: number;
  limit: number;
};

const mockGroupService = async () => ({
  increment: 1,
  groupsByEmail: new Map<string, Group[]>(),
  groupById: new Map<number, Group>(),

  async createGroup(creator: User, name: string) {
    const id = this.increment++;
    const group: Group = { id, name };
    this.groupsByEmail.set(
      creator.email,
      (this.groupsByEmail.get(creator.email) || []).concat([group]),
    );
    this.groupById.set(id, group);
    return group;
  },

  async createGroupByEmail(email: string, name: string) {
    const id = this.increment++;
    const group: Group = { id, name };
    this.groupsByEmail.set(email, (this.groupsByEmail.get(email) || []).concat([group]));
    this.groupById.set(id, group);
    return group;
  },

  async findGroupByEmail(email: string, options: Partial<PageInfo> = {}) {
    const { offset, limit } = {
      offset: 1,
      limit: 10,
      ...options,
    } as PageInfo;

    const start = (offset - 1) * limit;

    const arr = this.groupsByEmail.get(email) ?? [];
    const group = [...arr].slice(start, start + limit);
    return { group, count: arr.length };
  },

  async findGroupById(groupId: number) {
    return this.groupById.get(groupId);
  },
});

type MockGroupService = Awaited<ReturnType<typeof mockGroupService>>;

export { mockGroupService };
export type { MockGroupService };
