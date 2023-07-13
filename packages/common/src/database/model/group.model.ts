import { InferModel } from 'drizzle-orm';
import { groups } from '../schema';

type Group = InferModel<typeof groups>;

export default Group;
