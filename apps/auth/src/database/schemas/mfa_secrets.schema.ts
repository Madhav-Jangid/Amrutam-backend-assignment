import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.schema";



export const mfa_secrets = pgTable('mfa_secrets', {
  user_id: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  secret_encrypted: text('secret_encrypted').notNull(),
  backup_codes_hash: text('backup_codes_hash').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});