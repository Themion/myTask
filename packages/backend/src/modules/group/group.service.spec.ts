import { User, users } from '@my-task/common';
import { HttpException } from '@nestjs/common';
import { DatabaseError } from 'pg';
import { invalidEmail, mockDatabaseModule, mockGroupModule, validEmail } from '~/mock';
import { DatabaseService } from '~/modules/database/database.service';
import { GroupService } from './group.service';

describe('GroupService', () => {
  let service: GroupService;
  let creator: User;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const databaseModule = await mockDatabaseModule();
    databaseService = databaseModule.get<DatabaseService>(DatabaseService);
    await databaseService.onModuleInit();

    const module = await mockGroupModule({ databaseService });
    service = module.get<GroupService>(GroupService);
  });

  beforeEach(async () => {
    const creatorList = await databaseService.db
      .insert(users)
      .values({ email: validEmail })
      .onConflictDoNothing()
      .returning();
    if (creatorList.length > 0) creator = creatorList[0];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createGroup', () => {
    it('should work', async () => {
      const name = 'Test123';

      const createdGroups = await service.createGroup(creator, name);
      expect(createdGroups).toBeDefined();
      expect(createdGroups.name).toEqual(name);
    });

    describe('should throw error when', () => {
      it('cannot find creator from DB', async () => {
        creator.id = -1;
        await expect(service.createGroup(creator, 'invalid test')).rejects.toThrowError(
          DatabaseError,
        );
      });
    });
  });

  describe('createGroupByEmail', () => {
    it('should work', async () => {
      const name = 'Test123';

      const createdGroups = await service.createGroupByEmail(creator.email, name);
      expect(createdGroups).toBeDefined();
      expect(createdGroups.name).toEqual(name);
    });

    describe('should throw error when', () => {
      it('cannot find creator from DB', async () => {
        await expect(service.createGroupByEmail(invalidEmail, 'invalid test')).rejects.toThrowError(
          HttpException,
        );
      });
    });
  });

  describe('findGroupByEmail', () => {
    describe('should work with', () => {
      beforeEach(async () => {
        // Promise.all causes 'open handles' problem
        await service.createGroup(creator, 'test1');
        await service.createGroup(creator, 'test2');
        await service.createGroup(creator, 'test3');
      });

      it('no page info', async () => {
        const result = await service.findGroupByEmail(creator.email);
        expect(result).toBeDefined();
        expect(result.length).toEqual(3);
      });

      it('invalid email', async () => {
        const result = await service.findGroupByEmail(invalidEmail);
        expect(result).toBeDefined();
        expect(result.length).toEqual(0);
      });

      it('with offset, without limit', async () => {
        const result = await service.findGroupByEmail(creator.email, { offset: 2 });
        expect(result).toBeDefined();
        expect(result.length).toEqual(0);
      });

      it('without offset, with limit', async () => {
        const result = await service.findGroupByEmail(creator.email, { limit: 2 });
        expect(result).toBeDefined();
        expect(result.length).toEqual(2);
      });

      it('without offset and limit', async () => {
        const result = await service.findGroupByEmail(creator.email, { offset: 2, limit: 2 });
        expect(result).toBeDefined();
        expect(result.length).toEqual(1);
      });
    });
  });
});
