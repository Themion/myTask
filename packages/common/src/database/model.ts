import { InferModel } from 'drizzle-orm';
import { groups, members, users } from './schema';

type Group = InferModel<typeof groups>;
type Member = InferModel<typeof members>;
type User = InferModel<typeof users>;

export type { Group, Member, User };
