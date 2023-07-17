import { ConfirmJoinUserDTO, RequestJoinUserDTO, users } from '@my-task/common';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '~/modules/database/database.service';

@Injectable()
export class SignupService {
  private readonly db;
  private readonly uuidToEmail = new Map<string, RequestJoinUserDTO>();
  private readonly pendingEmail = new Set<string>();

  constructor(databaseService: DatabaseService) {
    this.db = databaseService.db;
  }

  readAll() {
    return this.db.select().from(users).execute();
  }

  requestJoinUser(dto: RequestJoinUserDTO) {
    if (this.pendingEmail.has(dto.email)) throw new BadRequestException('Emali already exists!');

    const uuid = uuidv4();

    this.uuidToEmail.set(uuid, dto);
    this.pendingEmail.add(dto.email);
    return uuid;
  }

  async confirmJoinUser(dto: ConfirmJoinUserDTO) {
    if (!this.uuidToEmail.has(dto.uuid))
      throw new BadRequestException('UUID cannot be found: Wrong DTO!');

    const data = this.uuidToEmail.get(dto.uuid) as RequestJoinUserDTO;
    this.uuidToEmail.delete(dto.uuid);
    this.pendingEmail.delete(data.email);

    const insertedUsers = await this.db.insert(users).values(data).returning();
    if (insertedUsers.length !== 1) throw new InternalServerErrorException('DB insertion failed!');
    else return insertedUsers[0];
  }
}
