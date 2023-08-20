import { invalidEmail, mockDatabaseModule, mockMemberModule, validEmail } from '~/mock';
import { DatabaseService } from '~/modules/database/database.service';
import { Group, User, groups, users } from '../../../../common/src';
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
});
