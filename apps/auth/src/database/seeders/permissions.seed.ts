import { PERMISSION } from '@/config/types.config';
import { dbClient } from '../auth.connection';
import { permissions } from '../schemas';
import { logger } from '@/utils/logger';

export async function seedPermissions() {
  try {
    const values = Object.values(PERMISSION).map((name) => ({
      name,
      description: generateDescription(name),
    }));

    await dbClient
      .insert(permissions)
      .values(values)
      .onConflictDoNothing();

    logger.info('Resource-based permissions seeded successfully');
  } catch (error) {
    logger.error('Permission seeding failed', error);
    throw error;
  }
}

function generateDescription(permission: string) {
  const [domain, action] = permission.split(':');
  return `Allows ${action} access on ${domain} resource`;
}
