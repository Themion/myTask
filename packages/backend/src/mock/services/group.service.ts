import { Group, User } from '@my-task/common';

const mockGroupService = async () => ({
  groups: new Map<string, Group[]>(),

  async createGroup(creator: User, name: string) {
    const id = Math.floor(Math.random() * 10);
    const group: Group = { id, name };
    this.groups.set(creator.email, (this.groups.get(creator.email) || []).concat([group]));
    return group;
  },

  async findGroupByMember(email: string) {
    return this.groups.get(email) ?? [];
  },
});

type MockGroupService = Awaited<ReturnType<typeof mockGroupService>>;

export { mockGroupService };
export type { MockGroupService };
