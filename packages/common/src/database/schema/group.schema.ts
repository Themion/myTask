import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 20 }),
});

export default groups;
