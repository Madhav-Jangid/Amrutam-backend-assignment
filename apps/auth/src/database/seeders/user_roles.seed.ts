import { dbClient } from '../auth.connection';
import { users, roles, user_roles } from '../schemas';
import { logger } from '@/utils/logger';
import { ROLE_NAME } from '@/config/types.config';

export async function seedUserRoles() {
  try {
    const allUsers = await dbClient.select().from(users);
    const allRoles = await dbClient.select().from(roles);

    const userMap = Object.fromEntries(
      allUsers.map(u => [u.email, u.id])
    );

    const roleMap = Object.fromEntries(
      allRoles.map(r => [r.name, r.id])
    );

    const assignments = [
      { email: 'admin@backend.com', role: ROLE_NAME.ADMIN },
      { email: 'doctor@backend.com', role: ROLE_NAME.DOCTOR },
      { email: 'patient@backend.com', role: ROLE_NAME.PATIENT },
      { email: 'support@backend.com', role: ROLE_NAME.SUPPORT },
    ];

    const values = assignments.map(a => ({
      user_id: userMap[a.email],
      role_id: roleMap[a.role],
      assigned_by: userMap['dev@backend.com'],
    }));

    await dbClient
      .insert(user_roles)
      .values(values)
      .onConflictDoNothing();

    logger.info('User roles seeded successfully');
  } catch (error) {
    logger.error('User role seeding failed', error);
    throw error;
  }
}
