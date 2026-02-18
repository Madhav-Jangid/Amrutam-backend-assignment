import { boolean, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.schema";




export const refresh_tokens = pgTable('refresh_tokens', {
  id: uuid('id').primaryKey().defaultRandom().unique(),
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  token_hash: text('token_hash').notNull().unique(),
  expires_at: timestamp('expires_at', { withTimezone: true }).defaultNow(),
  revoked: boolean('revoked').default(false),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  revoked_at: timestamp('revoked_at', { withTimezone: true }).defaultNow(),
  ip_address: text('ip_address'),
  user_agent: text('user_agent'),
},
  (table) => ({
    userIdx: uniqueIndex('user_id_idx').on(table.user_id),
  })
);