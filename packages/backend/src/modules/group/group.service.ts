import { GroupListDTO, User, groups, members, users } from '@my-task/common';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { DatabaseService } from '~/modules/database/database.service';

type PageInfo = {
  offset: number;
  limit: number;
};

@Injectable()
export class GroupService {
  private readonly db;
  constructor(databaseService: DatabaseService) {
    this.db = databaseService.db;
  }

  async createGroup(creator: User, name: string = 'My First Group') {
    return this.db.transaction(async (tx) => {
      const createdGroups = await tx.insert(groups).values({ name }).returning();
      if (createdGroups.length !== 1)
        throw new InternalServerErrorException('DB insertion failed when creating group!');
      const createdGroup = createdGroups[0];

      const createdCreators = await tx
        .insert(members)
        .values({ groupId: createdGroup.id, userId: creator.id, isManager: true })
        .returning();
      if (createdCreators.length !== 1)
        throw new InternalServerErrorException('DB insertion failed when inserting member!');

      return createdGroup;
    });
  }

  async createGroupByEmail(email: string, name: string) {
    return this.db.transaction(async (tx) => {
      const creator = await tx.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, email),
      });

      if (!creator) throw new BadRequestException(`User cannot be found with email: ${email}!`);

      return this.createGroup(creator, name);
    });
  }

  async findGroupByEmail(email: string, options: Partial<PageInfo> = {}): Promise<GroupListDTO> {
    const { offset, limit } = {
      offset: 1,
      limit: 10,
      ...options,
    } as PageInfo;

    const groupQuery = this.db
      .select({ id: groups.id, name: groups.name })
      .from(groups)
      .innerJoin(members, eq(groups.id, members.groupId))
      .innerJoin(users, eq(members.userId, users.id))
      .where(eq(users.email, email))
      .limit(limit)
      .offset((offset - 1) * limit);

    const groupCountQuery = this.db
      .select({
        count: sql<string>`count(${groups.id})`,
      })
      .from(groups)
      .innerJoin(members, eq(groups.id, members.groupId))
      .innerJoin(users, eq(members.userId, users.id))
      .where(eq(users.email, email));

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
}
