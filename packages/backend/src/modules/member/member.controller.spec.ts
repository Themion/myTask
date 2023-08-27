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

  beforeEach(async () => {
    const [memberService, emailService] = await Promise.all([
      mockMemberService(),
      mockEmailService(),
    ]);
    const module = await mockMemberModule({ memberService, emailService });

    controller = module.get<MemberController>(MemberController);
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
      const result = await controller.invite({ groupId, email: validEmail });
      expect(result).toBeDefined();
      expect(result).toHaveProperty('groupId');
      expect(result.groupId).toEqual(groupId);
    });

    describe('should throw with', () => {
      it('invalid email', async () => {
        await expect(controller.invite({ groupId, email: invalidEmail })).rejects.toThrow();
      });

      it('duplicate request', async () => {
        await controller.invite({ groupId, email: validEmail });
        await expect(controller.invite({ groupId, email: validEmail })).rejects.toThrow();
      });
    });
  });
});
