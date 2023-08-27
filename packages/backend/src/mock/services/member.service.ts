import { Member } from '@my-task/common';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { validEmail } from '~/mock';

const mockMemberService = async () => ({
  memberSet: new Set<string>(),

  async createMemberByEmail(groupId: number, email: string) {
    if (email !== validEmail) throw new BadRequestException('');
    if (this.memberSet.has(email + groupId)) throw new InternalServerErrorException('');
    this.memberSet.add(email + groupId);

    const ret: Member = {
      id: Math.floor(Math.random() * 10),
      groupId,
      userId: Math.floor(Math.random() * 10),
      isDeleted: false,
      isManager: false,
      name: '',
    };

    return ret;
  },

  async softDeleteMemberByEmail(groupId: number, email: string) {
    if (email !== validEmail) throw new BadRequestException('');
    if (!this.memberSet.has(email + groupId)) throw new InternalServerErrorException('');
    this.memberSet.delete(email + groupId);

    const ret: Member = {
      id: Math.floor(Math.random() * 10),
      groupId,
      userId: Math.floor(Math.random() * 10),
      isDeleted: false,
      isManager: false,
      name: '',
    };

    return ret;
  },
});

type MockMemberService = Awaited<ReturnType<typeof mockMemberService>>;

export { mockMemberService };
export type { MockMemberService };
