import {
  MockGroupService,
  MockMemberService,
  mockGroupModule,
  mockGroupService,
  mockMemberService,
  validEmail,
} from '~/mock';
import { Group } from '../../../../common/src';
import { GroupController } from './group.controller';

describe('GroupController', () => {
  let controller: GroupController;
  let groupService: MockGroupService;
  let memberService: MockMemberService;

  let name: string;
  let email: string;

  beforeEach(async () => {
    [groupService, memberService] = await Promise.all([mockGroupService(), mockMemberService()]);
    const module = await mockGroupModule({ groupService });
    controller = module.get<GroupController>(GroupController);
  });

  beforeEach(() => {
    email = validEmail;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createGroup', () => {
    beforeEach(() => {
      name = 'name123';
    });

    it('should work', async () => {
      const result = await controller.createGroup({ name }, email);
      expect(result).toBeDefined();
      expect(result.name).toEqual(name);
    });
  });

  describe('findGroup', () => {
    beforeEach(async () => {
      await Promise.allSettled(
        Array(3)
          .fill(0)
          .map((_, i) => controller.createGroup({ name: `test${i}` }, email)),
      );
    });

    describe('should work', () => {
      it('without page info', async () => {
        const result = await controller.findGroup(email);
        expect(result).toBeDefined();
        expect(result).toHaveProperty('group');
        expect(result.group.length).toEqual(3);
        expect(result).toHaveProperty('count');
        expect(result.count).toEqual(3);
      });

      it('with page', async () => {
        const result = await controller.findGroup(email, { offset: 2 });
        expect(result).toBeDefined();
        expect(result).toHaveProperty('group');
        expect(result.group.length).toEqual(0);
        expect(result).toHaveProperty('count');
        expect(result.count).toEqual(3);
      });
    });
  });

  describe('findGroupById', () => {
    let name: string;
    let group: Group;

    beforeEach(async () => {
      name = 'asdasdad';
      group = await groupService.createGroupByEmail(validEmail, name);
      await memberService.createMemberByEmail(group.id, validEmail);
    });

    // service 로직을 테스트하는 테스트 케이스는 넣지 않음
    it('should work', async () => {
      const result = await controller.findGroupById(validEmail, group.id);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('name');
      expect(result?.name).toEqual(name);
    });
  });
});
