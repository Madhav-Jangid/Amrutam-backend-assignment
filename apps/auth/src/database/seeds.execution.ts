import { connectDB } from './auth.connection';
import { runAllSeeders } from './seeders';
import { logger } from '@/utils/logger';

async function seed() {
  try {
    logger.info('Starting database seeding...');

    await connectDB();
    await runAllSeeders();

    logger.info('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Database seeding failed', error);
    process.exit(1);
  }
}

seed();
