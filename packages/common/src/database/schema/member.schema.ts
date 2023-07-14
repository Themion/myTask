import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import groups from './group.schema';
import users from './user.schema';

const members = pgTable('members', {
  id: serial('id').primaryKey(),
  groupId: integer('group_id')
    .references(() => groups.id)
    .notNull(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  name: varchar('name', { length: 20 }).default('member'),
});

export default members;
