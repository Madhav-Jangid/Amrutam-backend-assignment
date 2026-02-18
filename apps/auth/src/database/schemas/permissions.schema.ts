import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { permissionNameEnum } from "./enums.schema";



export const permissions = pgTable('permissions', {

  id: uuid('id').primaryKey().defaultRandom().unique(),

  description: text('description'),
  name: permissionNameEnum('name'),

  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});