import { groups } from '@my-task/common';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '~/modules/database/database.service';

@Injectable()
export class GroupService {
  private readonly db;
  constructor(databaseService: DatabaseService) {
    this.db = databaseService.db;
  }

  async createGroup(name: string = 'My First Group') {
    const createdGroups = await this.db.insert(groups).values({ name }).returning();
    if (createdGroups.length !== 1) throw new InternalServerErrorException('DB insertion failed!');
    else return createdGroups[0];
  }
}
