import express from 'express';
import 'dotenv/config';
import { app as authApp } from '@auth/app';
import { connectDB } from '@workspace/common';
import { logger } from '@workspace/common';

const startMonolith = async () => {
  logger.info('Starting Monolithic App...');

  // Initialize all databases
  await connectDB(process.env.DATABASE_URL!);

  const masterApp = express();
  const port = process.env.PORT || 6969;

  // Mount services
  masterApp.use('/auth', authApp);

  masterApp.listen(port, () => {
    logger.info(`Monolith listening on port ${port}`);
    logger.info(`Auth service available at http://localhost:${port}/auth`);
  });
};

startMonolith();
