import { InferModel } from 'drizzle-orm';
import { groups } from '../schema';

type Model = InferModel<typeof groups>;

export default Model;
