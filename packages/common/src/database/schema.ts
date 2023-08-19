import { boolean, integer, pgTable, serial, unique, varchar } from 'drizzle-orm/pg-core';

const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 320 }).unique().notNull(),
});

const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 20 }).notNull(),
});

const members = pgTable(
  'users_to_groups',
  {
    id: serial('id').primaryKey(),
    groupId: integer('group_id')
      .notNull()
      .references(() => groups.id),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    name: varchar('name', { length: 20 }).notNull().default('member'),
    isManager: boolean('is_manager').default(false),
  },
  (table) => ({
    unique: unique().on(table.groupId, table.userId),
  }),
);

export { users, groups, members };
