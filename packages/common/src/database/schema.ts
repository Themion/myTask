import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 320 }),
});

const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 20 }),
});

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

export { users, groups, members };
