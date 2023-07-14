import { Group, User } from '@my-task/common';

const mockGroupService = async () => ({
  groups: new Map<number, Group[]>(),
  async createGroup(creator: User, name: string) {
    const group: Group = {
      id: Math.floor(Math.random() * 10),
      name,
    };
    this.groups.set(creator.id, (this.groups.get(creator.id) || []).concat([group]));
    return group;
  },
  async findGroupByMember(member: User) {
    return this.groups.get(member.id) ?? [];
  },
});

type MockGroupService = Awaited<ReturnType<typeof mockGroupService>>;

export { mockGroupService };
export type { MockGroupService };
