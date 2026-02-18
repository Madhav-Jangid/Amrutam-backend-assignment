import bcrypt from 'bcrypt';
import { dbClient } from '../auth.connection';
import { users } from '../schemas';
import { logger } from '@/utils/logger';
import { USER_ACCOUNT_STATUS } from '@/config/types.config';

export async function seedUsers() {
  try {
    const defaultPassword = await bcrypt.hash('Password@123', 12);

    const seedData = [
      {
        email: 'admin@backend.com',
        phone: '9000000001',
        password_hash: defaultPassword,
        status: USER_ACCOUNT_STATUS.ACTIVE,
        email_verified: true,
        phone_verified: true,
        mfa_enabled: true,
      },
      {
        email: 'doctor@backend.com',
        phone: '9000000002',
        password_hash: defaultPassword,
        status: USER_ACCOUNT_STATUS.ACTIVE,
        email_verified: true,
        phone_verified: true,
        mfa_enabled: false,
      },
      {
        email: 'patient@backend.com',
        phone: '9000000003',
        password_hash: defaultPassword,
        status: USER_ACCOUNT_STATUS.ACTIVE,
        email_verified: true,
        phone_verified: false,
        mfa_enabled: false,
      },
      {
        email: 'support@backend.com',
        phone: '9000000004',
        password_hash: defaultPassword,
        status: USER_ACCOUNT_STATUS.ACTIVE,
        email_verified: true,
        phone_verified: true,
        mfa_enabled: false,
      },
      {
        email: 'dev@backend.com',
        phone: '6239102762',
        password_hash: defaultPassword,
        status: USER_ACCOUNT_STATUS.ACTIVE,
        email_verified: true,
        phone_verified: true,
        mfa_enabled: false,
      },
    ];

    await dbClient
      .insert(users)
      .values(seedData)
      .onConflictDoNothing();

    logger.info('Users seeded successfully');
  } catch (error) {
    logger.error('User seeding failed', error);
    throw error;
  }
}
