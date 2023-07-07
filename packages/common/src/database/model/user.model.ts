import { InferModel } from 'drizzle-orm';
import { users } from '../schema';

type User = InferModel<typeof users>;

export default User;
