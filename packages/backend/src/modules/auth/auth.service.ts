import { CreateUserDTO, users } from '@my-task/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '~/modules/database/database.service';

@Injectable()
export class AuthService {
  private readonly db;
  private readonly uuidToEmail = new Map<string, CreateUserDTO>();
  private readonly pendingEmail = new Set<string>();

  constructor(databaseService: DatabaseService) {
    this.db = databaseService.db;
  }

  readAll() {
    return this.db.select().from(users).execute();
  }

  createUser(dto: CreateUserDTO) {
    if (this.pendingEmail.has(dto.email)) throw new BadRequestException('Emali already exists!');

    const uuid = uuidv4();

    this.uuidToEmail.set(uuid, dto);
    this.pendingEmail.add(dto.email);
    return uuid;
  }
}
