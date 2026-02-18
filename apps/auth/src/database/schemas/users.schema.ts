import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  uuid
} from 'drizzle-orm/pg-core';
import { userStatusEnum } from './enums.schema';

// 1. Define the Enum first

export const users = pgTable('users', {
  // If using Supabase Auth, 'id' is usually a uuid text or uuid type
  id: uuid('id').primaryKey().defaultRandom().unique(),
  email: text('email').unique().notNull(),
  phone: text('phone').unique(),
  password_hash: text('password_hash').notNull(),

  // 2. Reference the enum constant defined above
  status: userStatusEnum('status').default('active'),

  // 3. Use boolean() instead of PgBoolean

  email_verified: boolean('email_verified').notNull().default(false),
  phone_verified: boolean('phone_verified').notNull().default(false),
  mfa_enabled: boolean('mfa_enabled').notNull().default(false),

  // 4. Use integer() for versions/counters
  token_version: integer('token_version').notNull().default(0),

  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
});