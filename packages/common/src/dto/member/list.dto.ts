import { Member, User } from '../../database';

type MemberListDTO = {
  member: Pick<User & Member, 'id' | 'email' | 'name' | 'isManager'>[];
  count: number;
};

export type { MemberListDTO };
