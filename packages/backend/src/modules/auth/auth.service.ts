import { CreateUserDTO } from '@my-task/common';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '~/modules/database/database.service';
import { users } from '~/modules/database/schema';

@Injectable()
export class AuthService {
  private readonly db;
  constructor(databaseService: DatabaseService) {
    this.db = databaseService.db;
  }

  readAll() {
    return this.db.select().from(users).execute();
  }

  async createUser(dto: CreateUserDTO) {
    const insertedUsers = await this.db.insert(users).values(dto).returning();

    if (insertedUsers.length !== 1) throw new InternalServerErrorException('DB insertion failed!');
    else return insertedUsers[0];
  }
}
