import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

export default defineConfig({
  schema: './src/database/schemas/index.ts',
  out: './src/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});