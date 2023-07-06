import { InferModel } from 'drizzle-orm';
import { users } from '~/modules/database/schema';

type User = InferModel<typeof users>;

export default User;
