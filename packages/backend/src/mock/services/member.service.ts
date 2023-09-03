import { Member, User } from '@my-task/common';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { invalidEmail, validEmail } from '~/mock';

type PageInfo = {
  offset: number;
};

const getMemberKey = (groupId: number, email: string) => email + groupId;

const mockMemberService = async () => ({
  memberIncrement: 1,
  userIncrement: 1,
  memberSet: new Set<string>(),

  async createMember(groupId: number, user: User, isManager: boolean) {
    return this.createMemberByEmail(groupId, user.email, isManager);
  },

  async createMemberByEmail(groupId: number, email: string, isManager: boolean = false) {
    if (email === invalidEmail) throw new BadRequestException('');

    const key = getMemberKey(groupId, email);

    if (this.memberSet.has(key)) throw new InternalServerErrorException('');
    this.memberSet.add(key);

    const ret: Member = {
      id: this.memberIncrement++,
      groupId,
      userId: this.userIncrement++,
      isDeleted: false,
      isManager,
      name: '',
    };

    return ret;
  },

  async softDeleteMemberByEmail(groupId: number, email: string) {
    if (email !== validEmail) throw new BadRequestException('');

    const key = getMemberKey(groupId, email);

    if (!this.memberSet.has(key)) throw new InternalServerErrorException('');
    this.memberSet.delete(key);

    const ret: Member = {
      id: this.memberIncrement++,
      groupId,
      userId: this.userIncrement++,
      isDeleted: false,
      isManager: false,
      name: '',
    };

    return ret;
  },

  async findIfUserIsMember(groupId: number, email: string) {
    return this.memberSet.has(getMemberKey(groupId, email));
  },

  async findMemberByGroupId(groupId: number, options: Partial<PageInfo> = {}) {
    const limit = 30;
    const offset = options.offset ?? 1;

    const start = (offset - 1) * limit;

    const member = [...this.memberSet]
      .filter((key) => new RegExp(`${groupId}$`).test(key))
      .slice(start, start + limit);
    const count = this.memberSet.size;

    return { member, count };
  },
});

type MockMemberService = Awaited<ReturnType<typeof mockMemberService>>;

export { mockMemberService };
export type { MockMemberService };
