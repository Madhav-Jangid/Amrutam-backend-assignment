import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { json } from 'body-parser';
import morgan from 'morgan';
import { errorHandler, NotFoundError } from '@workspace/common';
import { auditLogger } from '@auth/middlewares/auth.audit-logger';
import { rateLimiter } from '@auth/middlewares/auth.rate-limiter';
import { healthRouter } from '@auth/modules/health/health.routes';

const app: express.Application = express();

app.set('trust proxy', true);
app.use(json());
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

// Global Middlewares
app.use(auditLogger);
app.use(rateLimiter);

// Routes
app.use('/health', healthRouter);

app.all('*', async (req: Request, res: Response) => {
  throw new NotFoundError();
});

// Error Handling
app.use(errorHandler);

export { app };
