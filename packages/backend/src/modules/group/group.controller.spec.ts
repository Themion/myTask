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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createGroup', () => {
    beforeEach(() => {
      name = 'name123';
      email = validEmail;
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
});
