import {
  invalidEmail,
  mockEmailService,
  mockMemberModule,
  mockMemberService,
  validEmail,
} from '~/mock';
import { MemberController } from './member.controller';

describe('MemberController', () => {
  let controller: MemberController;
  let name: string;

  beforeEach(async () => {
    const [memberService, emailService] = await Promise.all([
      mockMemberService(),
      mockEmailService(),
    ]);
    const module = await mockMemberModule({ memberService, emailService });

    controller = module.get<MemberController>(MemberController);
    name = 'member';
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('invite', () => {
    let groupId: number;

    beforeEach(() => {
      groupId = Math.floor(Math.random() * 10);
    });

    it('should work', async () => {
      const result = await controller.invite({ groupId, name, email: validEmail });
      expect(result).toBeDefined();
      expect(result).toHaveProperty('groupId');
      expect(result.groupId).toEqual(groupId);
    });

    describe('should throw with', () => {
      it('invalid email', async () => {
        await expect(controller.invite({ groupId, name, email: invalidEmail })).rejects.toThrow();
      });

      it('duplicate request', async () => {
        await controller.invite({ groupId, name, email: validEmail });
        await expect(controller.invite({ groupId, name, email: validEmail })).rejects.toThrow();
      });
    });
  });

  describe('leave', () => {
    let groupId: number;

    beforeEach(async () => {
      groupId = Math.floor(Math.random() * 10);
      await controller.invite({ groupId, name, email: validEmail });
    });

    it('should work', async () => {
      const result = await controller.leave(validEmail, { groupId });
      expect(result).toBeDefined();
      expect(result).toHaveProperty('groupId');
      expect(result.groupId).toEqual(groupId);
    });

    describe('should throw with', () => {
      it('invalid email', async () => {
        await expect(controller.leave(invalidEmail, { groupId })).rejects.toThrow();
      });

      it('duplicate request', async () => {
        await controller.leave(validEmail, { groupId });
        await expect(controller.leave(validEmail, { groupId })).rejects.toThrow();
      });
    });
  });

  describe('findMemberByGroupId', () => {
    let groupId: number;

    beforeEach(async () => {
      groupId = Math.floor(Math.random() * 10);
      await Promise.all(
        new Array(40)
          .fill(0)
          .map((_, i) => `test${i}@email.com`)
          .concat(validEmail)
          .map((email) => controller.invite({ groupId, name, email })),
      );
    });

    describe('should work', () => {
      it('without page info', async () => {
        const result = await controller.findMemberByGroupId(validEmail, groupId);
        expect(result).toBeDefined();
        expect(result).toHaveProperty('member');
        expect(result).toHaveProperty('count');
        expect(result.member.length).toEqual(30);
        expect(result.count).toEqual(41);
      });

      it('with page', async () => {
        const result = await controller.findMemberByGroupId(validEmail, groupId, { offset: 2 });
        expect(result).toBeDefined();
        expect(result).toHaveProperty('member');
        expect(result).toHaveProperty('count');
        expect(result.member.length).toEqual(11);
        expect(result.count).toEqual(41);
      });
    });

    describe('should throw error when', () => {
      it('invalid email', async () => {
        await expect(controller.findMemberByGroupId(invalidEmail, groupId, {})).rejects.toThrow();
      });

      it('invalid group id', async () => {
        await expect(controller.findMemberByGroupId(validEmail, -1, {})).rejects.toThrow();
      });
    });
  });
});
