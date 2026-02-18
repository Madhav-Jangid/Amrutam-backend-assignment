import { boolean, integer, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.schema";
import { sql } from "drizzle-orm";

export const otps = pgTable('otps', {
  id: uuid('id').primaryKey(),
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  otp: integer('otp').notNull(),
  is_used: boolean('is_used').notNull().default(false),
  expires_at: timestamp('expires_at', { withTimezone: true })
    .notNull()
    .default(sql`NOW() + INTERVAL '10 minutes'`),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
},
  (table) => ({
    otp_id_idx: uniqueIndex('otp_id_idx').on(table.id),
  })
);


