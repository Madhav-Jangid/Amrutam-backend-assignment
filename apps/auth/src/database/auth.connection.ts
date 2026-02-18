import { connectDB as connectSharedDB, SQL } from '@workspace/common';
import { config } from '@auth/config/auth.config';
import { logger } from '@auth/utils/logger';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schemas';



export const sql: SQL = connectSharedDB(process.env.AUTH_DATABASE_URL! || config.database.url);

export const db = drizzle(sql, { schema });

export const connectDB = async () => {
  try {
    await sql`SELECT 1`;
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Database connection failed', error);
    process.exit(1);
  }
};

export { sql as sqlClient, db as dbClient };

