import { Injectable } from '@nestjs/common';
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
}
