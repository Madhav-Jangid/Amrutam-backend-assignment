import 'dotenv/config';
import { app } from '@auth/app';
import { connectDB } from '@auth/database/auth.connection';
import { config } from '@auth/config/auth.config';
import { logger } from '@auth/utils/logger';

const start = async () => {
  logger.info(`Starting ${config.service.name} Service...`);

  await connectDB();

  const port = config.service.port || process.env.PORT || 3000;
  const server = app.listen(port, () => {
    logger.info(`${config.service.name} service listening on port ${port}`);

    import('./utils/self-health-check').then(({ startSelfHealthCheck }) => {
      startSelfHealthCheck(`http://localhost:${port}/health`);
    });

  });

  const gracefulShutdown = () => {
    logger.info('Received kill signal, shutting down gracefully');
    server.close(() => {
      logger.info('Closed out remaining connections');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
};

start();
