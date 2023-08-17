import { Group } from '../../database';

type GroupListDTO = {
  group: Pick<Group, 'id' | 'name'>[];
  count: number;
};

export type { GroupListDTO };
