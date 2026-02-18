import postgres from 'postgres';
import { logger } from '../logger';

export type SQL = postgres.Sql;

export const sql: SQL = postgres(process.env.DATABASE_URL!);


export const connectDB = (url: string): SQL => {
  const sql = postgres(url, {
    ssl: 'require',
  });

  return sql;
};


export const checkDb = async () => {
  try {
    await sql`SELECT 1`;
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Database connection failed', error);
    process.exit(1);
  }
};

export default sql;
