import { pgTable, uuid, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { users } from "./users.schema";
import { roles } from "./roles.schema";

export const user_roles = pgTable(
  'user_roles',
  {
    user_id: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    role_id: uuid('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),

    assigned_by: uuid('assigned_by')
      .references(() => users.id, { onDelete: 'set null' }),

    assigned_at: timestamp('assigned_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.user_id, table.role_id],
    }),
  })
);
