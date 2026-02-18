import { logger } from '@/utils/logger';
import { roles } from '../schemas';
import { dbClient } from '../auth.connection';
import { uuid } from 'uuidv4';
import { ROLE_NAME } from '@/config/types.config';


export async function seedRoles() {

  const existing = await dbClient.query.roles.findMany();

  if (existing.length > 0) {
    logger.info('Roles already seeded');
    return;
  }

  await dbClient.insert(roles).values([
    { id: uuid(), name: ROLE_NAME.ADMIN },
    { id: uuid(), name: ROLE_NAME.DOCTOR },
    { id: uuid(), name: ROLE_NAME.PATIENT },
    { id: uuid(), name: ROLE_NAME.SUPPORT },
  ]);

  logger.info('Roles seeded');
}
