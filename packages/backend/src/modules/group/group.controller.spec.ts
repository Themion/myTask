import { MockGroupService, mockGroupModule, mockGroupService, validEmail } from '~/mock';
import { GroupController } from './group.controller';

describe('GroupController', () => {
  let controller: GroupController;
  let groupService: MockGroupService;

  let name: string;
  let email: string;

  beforeEach(async () => {
    groupService = await mockGroupService();
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

    describe('should throw error when', () => {
      it('invalid body', async () => {
        await expect(async () => controller.createGroup({}, email)).rejects.toThrow();
      });
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
        expect(result.length).toEqual(3);
      });

      it('with page', async () => {
        const result = await controller.findGroup(email, 2);
        expect(result).toBeDefined();
        expect(result.length).toEqual(0);
      });
    });
  });
});
