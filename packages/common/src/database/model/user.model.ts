import { InferModel } from 'drizzle-orm';
import { users } from '~/database/schema';

type User = InferModel<typeof users>;

export default User;
