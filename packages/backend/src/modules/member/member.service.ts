import {
  MemberListDTO,
  PageInfo,
  User,
  groups,
  members,
  mergeObjects,
  users,
} from '@my-task/common';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { and, asc, desc, eq, sql } from 'drizzle-orm';
import { DatabaseService } from '~/modules/database/database.service';

const defaultPageInfo: PageInfo = {
  offset: 1,
  limit: 30,
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

  async softDeleteMember(groupId: number, user: Pick<User, 'id'>) {
    const softDeletedMembers = await this.db
      .update(members)
      .set({ isDeleted: true })
      .where(and(eq(members.groupId, groupId), eq(members.userId, user.id)))
      .returning();

    if (softDeletedMembers.length !== 1)
      throw new InternalServerErrorException('DB updated failed when updating member!');

    return softDeletedMembers[0];
  }

  async softDeleteMemberByEmail(groupId: number, email: string) {
    const user = await this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
      columns: { id: true },
    });

    if (!user) throw new BadRequestException('Wrong Email!');

    return this.softDeleteMember(groupId, user);
  }

  async findIfUserIsMember(groupId: number, email: string) {
    const result = await this.db
      .select({ id: users.id })
      .from(members)
      .innerJoin(users, eq(members.userId, users.id))
      .where(
        and(eq(users.email, email), eq(members.groupId, groupId), eq(members.isDeleted, false)),
      );

    return result.length === 1 ? result[0].id : -1;
  }

  async findMemberByGroupId(
    groupId: number,
    options: Partial<PageInfo> = {},
  ): Promise<MemberListDTO> {
    const { offset, limit } = mergeObjects(options, defaultPageInfo) as PageInfo;

    const memberArrayQuery = this.db
      .select({
        id: users.id,
        email: users.email,
        name: members.name,
        isManager: members.isManager,
        isDeleted: members.isDeleted,
      })
      .from(users)
      .innerJoin(members, eq(members.userId, users.id))
      .innerJoin(groups, eq(groups.id, members.groupId))
      .where(and(eq(groups.id, groupId), eq(members.isDeleted, false)))
      .limit(limit)
      .offset((offset - 1) * limit)
      .orderBy(desc(members.isManager), asc(members.id));

    const memberCountQuery = this.db
      .select({
        count: sql<string>`count(${members.id})`,
      })
      .from(members)
      .innerJoin(groups, eq(groups.id, members.groupId))
      .where(and(eq(groups.id, groupId), eq(members.isDeleted, false)));

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
