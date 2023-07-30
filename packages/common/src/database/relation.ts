import { relations } from 'drizzle-orm';
import { groups, members, users } from './schema';

const usersRelations = relations(users, ({ many }) => ({
  members: many(members),
}));

const groupsRelations = relations(groups, ({ many }) => ({
  members: many(members),
}));

const membersRelations = relations(members, ({ one }) => ({
  groups: one(groups, {
    fields: [members.groupId],
    references: [groups.id],
  }),
  users: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
}));

export { groupsRelations, membersRelations, usersRelations };
