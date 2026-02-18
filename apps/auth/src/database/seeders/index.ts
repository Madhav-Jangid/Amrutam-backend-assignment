// export * from './roles.seed';
// export * from './permissions.seed';
// export * from './role_permissions.seed';
// export * from './users.seed';
// export * from './user_roles.seed';
// export * from './mfa_secrets.schema';
// export * from './profile.schema';
// export * from './refresh_tokens.schema';
// export * from './sessions.schema';
// export * from './otp.schema';

import { seedRoles } from './roles.seed';
import { seedPermissions } from './permissions.seed';
import { seedUsers } from './users.seed';
import { seedRolePermissions } from './role_permissions.seed';
import { seedUserRoles } from './user_roles.seed';

export async function runAllSeeders() {
  await seedRoles();
  await seedPermissions();
  await seedUsers();
  await seedRolePermissions();
  await seedUserRoles();
}