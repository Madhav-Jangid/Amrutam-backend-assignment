import {
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { genderEnum } from './enums.schema';



export const profiles = pgTable('profiles', {
  id: uuid('id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),

  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  avatar_url: text('avatar_url'),

  date_of_birth: timestamp('date_of_birth', { withTimezone: false }),
  gender: genderEnum('gender'),

  address_line1: text('address_line1'),
  address_line2: text('address_line2'),
  city: text('city'),
  state: text('state'),
  country: text('country'),
  postal_code: text('postal_code'),

  timezone: text('timezone'),

  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
