import { MemberListDTO, User, groups, members, users } from '@my-task/common';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { asc, desc, eq, sql } from 'drizzle-orm';
import { DatabaseService } from '~/modules/database/database.service';

type PageInfo = {
  offset: number;
};

@Injectable()
export class MemberService {
  private readonly db;
  constructor(databaseService: DatabaseService) {
    this.db = databaseService.db;
  }

  async createMember(groupId: number, user: Pick<User, 'id'>, isManager: boolean = false) {
    const createdCreators = await this.db
      .insert(members)
      .values({ groupId, userId: user.id, isManager })
      .returning();
    if (createdCreators.length !== 1)
      throw new InternalServerErrorException('DB insertion failed when inserting member!');

    return createdCreators[0];
  }

  async createMemberByEmail(groupId: number, email: string, isManager: boolean = false) {
    const user = await this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
      columns: { id: true },
    });

    if (!user) throw new BadRequestException('Wrong Email!');

    return this.createMember(groupId, user, isManager);
  }

  async findMemberByGroupId(
    groupId: number,
    options: Partial<PageInfo> = {},
  ): Promise<MemberListDTO> {
    const limit = 30;
    const offset = options.offset ?? 1;

    const memberArrayQuery = this.db
      .select({
        id: users.id,
        email: users.email,
        name: members.name,
        isManager: members.isManager,
      })
      .from(users)
      .innerJoin(members, eq(members.userId, users.id))
      .innerJoin(groups, eq(groups.id, members.groupId))
      .where(eq(groups.id, groupId))
      .limit(limit)
      .offset((offset - 1) * limit)
      .orderBy(desc(members.isManager), asc(members.id));

    const memberCountQuery = this.db
      .select({
        count: sql<string>`count(${members.id})`,
      })
      .from(members)
      .innerJoin(groups, eq(groups.id, members.groupId))
      .where(eq(groups.id, groupId));

    const [memberArrayResult, memberCountResult] = await Promise.allSettled([
      memberArrayQuery,
      memberCountQuery,
    ]);
    const member = memberArrayResult.status === 'fulfilled' ? memberArrayResult.value : [];
    const [count] = (
      memberCountResult.status === 'fulfilled' ? memberCountResult.value : [{ count: '0' }]
    ).map(({ count }) => parseInt(count));

    return { member, count };
  }
}
