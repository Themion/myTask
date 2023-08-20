import { User, members } from '@my-task/common';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '~/modules/database/database.service';

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
}
