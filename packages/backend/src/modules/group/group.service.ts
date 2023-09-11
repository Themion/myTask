import {
  GroupListDTO,
  PageInfo,
  User,
  groups,
  members,
  mergeObjects,
  users,
} from '@my-task/common';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { DatabaseService } from '~/modules/database/database.service';
import { MemberService } from '~/modules/member/member.service';

const defaultPageInfo: PageInfo = {
  offset: 1,
  limit: 10,
};

@Injectable()
export class GroupService {
  private readonly db;
  constructor(private readonly memberService: MemberService, databaseService: DatabaseService) {
    this.db = databaseService.db;
  }

  async createGroup(creator: User, name: string = 'My First Group') {
    const createdGroups = await this.db.insert(groups).values({ name }).returning();
    if (createdGroups.length !== 1)
      throw new InternalServerErrorException('DB insertion failed when creating group!');
    const createdGroup = createdGroups[0];

    await this.memberService.createMember(createdGroup.id, creator, true);
    return createdGroup;
  }

  async createGroupByEmail(email: string, name: string) {
    const creator = await this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!creator) throw new BadRequestException(`User cannot be found with email: ${email}!`);

    return this.createGroup(creator, name);
  }

  async findGroupByEmail(email: string, options: Partial<PageInfo> = {}): Promise<GroupListDTO> {
    const { offset, limit } = mergeObjects(options, defaultPageInfo) as PageInfo;

    const groupQuery = this.db
      .select({ id: groups.id, name: groups.name })
      .from(groups)
      .innerJoin(members, eq(groups.id, members.groupId))
      .innerJoin(users, eq(members.userId, users.id))
      .where(and(eq(users.email, email), eq(members.isDeleted, false)))
      .limit(limit)
      .offset((offset - 1) * limit);

    const groupCountQuery = this.db
      .select({
        count: sql<string>`count(${groups.id})`,
      })
      .from(groups)
      .innerJoin(members, eq(groups.id, members.groupId))
      .innerJoin(users, eq(members.userId, users.id))
      .where(and(eq(users.email, email), eq(members.isDeleted, false)));

    const [groupArrayResult, groupCountResult] = await Promise.allSettled([
      groupQuery,
      groupCountQuery,
    ]);
    const group = groupArrayResult.status === 'fulfilled' ? groupArrayResult.value : [];
    const [count] = (
      groupCountResult.status === 'fulfilled' ? groupCountResult.value : [{ count: '0' }]
    ).map(({ count }) => parseInt(count));

    return { group, count };
  }

  async findGroupById(groupId: number, email: string) {
    const result = await this.db
      .select({
        id: groups.id,
        name: groups.name,
        isManager: members.isManager,
      })
      .from(groups)
      .innerJoin(members, eq(groups.id, members.groupId))
      .innerJoin(users, eq(members.userId, users.id))
      .where(and(eq(groups.id, groupId), eq(users.email, email)));

    if (result.length !== 1) throw new InternalServerErrorException('');

    return result[0];
  }
}
