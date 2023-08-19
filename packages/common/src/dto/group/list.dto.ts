import { Group } from '../../database';

type GroupListDTO = {
  group: Pick<Group, 'id' | 'name'>[];
};

export type { GroupListDTO };
