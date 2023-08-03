import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 320 }).unique().notNull(),
});

const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 20 }).notNull(),
});

const members = pgTable('users_to_groups', {
  id: serial('id').primaryKey(),
  groupId: integer('group_id')
    .notNull()
    .references(() => groups.id),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  name: varchar('name', { length: 20 }).notNull().default('member'),
});

export { users, groups, members };