import { pgTable, boolean, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.schema";





export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom().unique(),
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  device_info: text('device_info'),
  ip_addreress: text('ip_address'),
  revoked: boolean('revoked').default(false),
  last_active_at: timestamp('Last_active_at', { withTimezone: true }).defaultNow(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});