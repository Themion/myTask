import { users } from '@my-task/common';
import { InferModel } from 'drizzle-orm';

type User = InferModel<typeof users>;

export default User;
