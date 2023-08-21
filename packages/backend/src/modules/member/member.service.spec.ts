import { Group, User, groups, members, users } from '@my-task/common';
import { and, eq } from 'drizzle-orm';
import { invalidEmail, mockDatabaseModule, mockMemberModule, validEmail } from '~/mock';
import { DatabaseService } from '~/modules/database/database.service';
import { MemberService } from './member.service';

describe('MemberService', () => {
  let service: MemberService;
  let databaseService: DatabaseService;
  let user: User;
  let group: Group;

  beforeEach(async () => {
    const databaseModule = await mockDatabaseModule();
    databaseService = databaseModule.get<DatabaseService>(DatabaseService);
    await databaseService.onModuleInit();

    const module = await mockMemberModule({ databaseService });

    service = module.get<MemberService>(MemberService);

    await databaseService.onModuleInit();
  });

  beforeEach(async () => {
    const results = await Promise.allSettled([
      databaseService.db.insert(users).values({ email: validEmail }).returning(),
      databaseService.db.insert(groups).values({ name: 'test' }).returning(),
    ]);

    const getFromSettledResult = <T>(result: PromiseSettledResult<T>) =>
      result.status === 'fulfilled' ? result.value : null;

    const getFirstData = <T>(arr: T[] | null) => (arr && arr.length === 1 ? arr[0] : null);

    const userResult = getFirstData(getFromSettledResult(results[0]));
    const groupResult = getFirstData(getFromSettledResult(results[1]));

    if (!userResult || !groupResult) throw '';

    user = userResult;
    group = groupResult;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createMember', () => {
    describe('should work with', () => {
      it('should work', async () => {
        const member = await service.createMember(group.id, user);
        expect(member).toBeDefined();
        expect(member.groupId).toEqual(group.id);
        expect(member.userId).toEqual(user.id);
        expect(member.isManager).toEqual(false);
      });

      it('with manager flag', async () => {
        const member = await service.createMember(group.id, user, true);
        expect(member).toBeDefined();
        expect(member.groupId).toEqual(group.id);
        expect(member.userId).toEqual(user.id);
        expect(member.isManager).toEqual(true);
      });
    });

    describe('should throw error when', () => {
      it('wrong group id', async () => {
        await expect(service.createMember(-1, user)).rejects.toThrow();
      });

      it('wrong user id', async () => {
        user.id = -1;
        await expect(service.createMember(group.id, user)).rejects.toThrow();
      });

      it('duplicate request', async () => {
        await service.createMember(group.id, user);
        await expect(service.createMember(group.id, user)).rejects.toThrow();
      });
    });
  });

  describe('createMemberByEmail', () => {
    it('should work', async () => {
      await expect(service.createMemberByEmail(group.id, user.email)).resolves.not.toThrow();
    });

    it('should throw error with invalid email', async () => {
      await expect(service.createMemberByEmail(group.id, invalidEmail)).rejects.toThrow();
    });
  });

  describe('softDelteMember', () => {
    beforeEach(async () => {
      await databaseService.db.insert(members).values({
        groupId: group.id,
        userId: user.id,
      });
    });

    it('should work', async () => {
      const deletedMember = await service.softDelteMember(group.id, user);
      expect(deletedMember).toBeDefined();

      const result = await databaseService.db
        .select()
        .from(members)
        .where(
          and(
            eq(members.groupId, group.id),
            eq(members.userId, user.id),
            eq(members.isDeleted, true),
          ),
        );
      expect(result.length).toEqual(1);
    });

    describe('should throw error when', () => {
      it('invalid group id', async () => {
        await expect(service.softDelteMember(-1, user)).rejects.toThrow();
      });

      it('invalid user id', async () => {
        user.id = -1;
        await expect(service.softDelteMember(group.id, user)).rejects.toThrow();
      });
    });
  });

  describe('softDelteMemberByEmail', () => {
    beforeEach(async () => {
      await databaseService.db.insert(members).values({
        groupId: group.id,
        userId: user.id,
      });
    });

    it('should work', async () => {
      const deletedMember = await service.softDelteMemberByEmail(group.id, user.email);
      expect(deletedMember).toBeDefined();
    });

    describe('should throw error when', () => {
      it('invalid group id', async () => {
        await expect(service.softDelteMemberByEmail(-1, user.email)).rejects.toThrow();
      });

      it('invalid user email', async () => {
        user.id = -1;
        await expect(service.softDelteMemberByEmail(group.id, invalidEmail)).rejects.toThrow();
      });
    });
  });

  describe('findMemberByGroupId', () => {
    let emailArr: string[];
    let userArr: User[];

    beforeEach(async () => {
      emailArr = new Array(3).fill(0).map((_, i) => `test${i}@email.com`);

      userArr = await databaseService.db
        .insert(users)
        .values(emailArr.map((email) => ({ email })))
        .returning();
      await databaseService.db
        .insert(members)
        .values(
          userArr.map((user, idx) => ({
            groupId: group.id,
            userId: user.id,
            name: user.email.split('@')[0],
            isManager: idx === 2,
          })),
        )
        .returning();
    });

    describe('should work', () => {
      it('with no page info', async () => {
        const result = await service.findMemberByGroupId(group.id);
        expect(result).toBeDefined();
        expect(result).toHaveProperty('member');
        expect(result.member.length).toEqual(3);
        result.member.forEach((m, idx) => expect(m.isManager).toEqual(idx === 0));
        expect(result).toHaveProperty('count');
        expect(result.count).toEqual(3);
      });

      it('invalid group id', async () => {
        const { member } = await service.findMemberByGroupId(-1);
        expect(member.length).toEqual(0);
      });

      it('with offset', async () => {
        const { member, count } = await service.findMemberByGroupId(group.id, { offset: 2 });
        expect(member.length).toEqual(0);
        expect(count).toEqual(3);
      });
    });
  });
});
