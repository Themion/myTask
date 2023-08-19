import { User, groups, members } from '@my-task/common';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '~/modules/database/database.service';

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
        .values({ groupId: createdGroup.id, userId: creator.id })
        .returning();
      if (createdCreators.length !== 1)
        throw new InternalServerErrorException('DB insertion failed when inserting member!');

      return createdGroup;
    });
  }

  async findGroupByEmail(email: string) {
    const result = await this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
      columns: {},
      with: {
        members: {
          columns: {},
          with: {
            groups: true,
          },
        },
      },
    });
    if (!result) return null;

    return result.members.map((userGroup) => userGroup.groups);
  }
}
