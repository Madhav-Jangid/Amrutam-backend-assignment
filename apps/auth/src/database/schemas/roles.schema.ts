import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { roleNameEnum } from "./enums.schema";



export const roles = pgTable('roles', {

  id: uuid('id').primaryKey().defaultRandom(),

  description: text('description'),
  name: roleNameEnum('name'),

  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});