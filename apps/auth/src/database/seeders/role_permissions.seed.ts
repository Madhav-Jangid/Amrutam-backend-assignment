import { PERMISSION, ROLE_NAME } from '@/config/types.config';
import { dbClient } from '../auth.connection';
import { roles, permissions, role_permissions } from '../schemas';
import { logger } from '@/utils/logger';
export async function seedRolePermissions() {
  const allRoles = await dbClient.select().from(roles);
  const allPermissions = await dbClient.select().from(permissions);

  const roleMap = Object.fromEntries(
    allRoles.map(r => [r.name, r.id])
  );

  const permissionMap = Object.fromEntries(
    allPermissions.map(p => [p.name, p.id])
  );

  const mappings = [
    {
      role: ROLE_NAME.ADMIN,
      permissions: Object.values(PERMISSION), // full access
    },
    {
      role: ROLE_NAME.DOCTOR,
      permissions: [
        PERMISSION.PROFILE_READ,
        PERMISSION.PROFILE_UPDATE,
        PERMISSION.AVAILABILITY_CREATE,
        PERMISSION.AVAILABILITY_UPDATE,
        PERMISSION.AVAILABILITY_DELETE,
        PERMISSION.AVAILABILITY_READ,
        PERMISSION.BOOKING_READ,
        PERMISSION.BOOKING_CANCEL,
        PERMISSION.CONSULTATION_START,
        PERMISSION.CONSULTATION_END,
        PERMISSION.CONSULTATION_READ,
        PERMISSION.CONSULTATION_UPDATE,
        PERMISSION.PRESCRIPTION_CREATE,
        PERMISSION.PRESCRIPTION_READ,
        PERMISSION.PRESCRIPTION_UPDATE,
        PERMISSION.SEARCH_DOCTOR,
        PERMISSION.SEARCH_CONSULTATION,
      ],
    },
    {
      role: ROLE_NAME.PATIENT,
      permissions: [
        PERMISSION.PROFILE_READ,
        PERMISSION.PROFILE_UPDATE,
        PERMISSION.DOCTOR_READ,
        PERMISSION.AVAILABILITY_READ,
        PERMISSION.BOOKING_CREATE,
        PERMISSION.BOOKING_CANCEL,
        PERMISSION.BOOKING_READ,
        PERMISSION.CONSULTATION_READ,
        PERMISSION.PRESCRIPTION_READ,
        PERMISSION.PAYMENT_INITIATE,
        PERMISSION.PAYMENT_READ,
        PERMISSION.SEARCH_DOCTOR,
      ],
    },
    {
      role: ROLE_NAME.SUPPORT,
      permissions: [
        PERMISSION.USER_READ,
        PERMISSION.USER_UPDATE,
        PERMISSION.DOCTOR_READ,
        PERMISSION.BOOKING_READ,
        PERMISSION.BOOKING_CANCEL,
        PERMISSION.CONSULTATION_READ,
        PERMISSION.PAYMENT_READ,
        PERMISSION.PAYMENT_REFUND,
        PERMISSION.SEARCH_DOCTOR,
        PERMISSION.SEARCH_CONSULTATION,
        PERMISSION.AUDIT_READ,
      ],
    },
  ];

  const values = mappings.flatMap(m =>
    m.permissions.map(p => ({
      role_id: roleMap[m.role],
      permission_id: permissionMap[p],
    }))
  );

  await dbClient
    .insert(role_permissions)
    .values(values)
    .onConflictDoNothing();

  logger.info('Role-permissions seeded (resource-based)');
}
