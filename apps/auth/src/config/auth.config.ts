import path from 'path';
import dotenv from 'dotenv';

// Load root .env if not already loaded (though typically passed by runner or docker)
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const getDatabaseUrl = () => {
  const url = process.env.AUTH_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL or AUTH_DATABASE_URL environment variable is not set');
  }
  return url;
};

export const config = {
  service: {
    name: 'auth',
    port: process.env.PORT || 3000,
  },
  database: {
    url: getDatabaseUrl(),
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'super-secret-key',
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '1h',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },
};
