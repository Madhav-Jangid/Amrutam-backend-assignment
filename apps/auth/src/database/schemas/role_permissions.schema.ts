import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { roles } from "./roles.schema";
import { permissions } from "./permissions.schema";



export const role_permissions = pgTable('role_permissions', {
  role_id: uuid('role_id')
    .references(() => roles.id, { onDelete: 'cascade' }),
  permission_id: uuid('permission_id')
    .references(() => permissions.id, { onDelete: 'cascade' }),
});