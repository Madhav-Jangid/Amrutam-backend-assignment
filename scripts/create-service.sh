#!/bin/bash

# Exit on error
set -e

# Prompt for service name if not provided
if [ -z "$1" ]; then
    read -p "Enter service name (e.g., patient, booking): " SERVICE_NAME
else
    SERVICE_NAME=$1
fi

if [ -z "$SERVICE_NAME" ]; then
    echo "Error: Service name is required."
    exit 1
fi

# Convert to various cases
SERVICE_LOWER=$(echo "$SERVICE_NAME" | tr '[:upper:]' '[:lower:]')
SERVICE_UPPER=$(echo "$SERVICE_NAME" | tr '[:lower:]' '[:upper:]')
# Capitalize: first letter upper, rest lower
SERVICE_CAPITALIZED=$(echo "$SERVICE_LOWER" | awk '{print toupper(substr($0,1,1)) substr($0,2)}')

ROOT_DIR="$(pwd)"
APPS_DIR="$ROOT_DIR/apps"
NEW_SERVICE_DIR="$APPS_DIR/$SERVICE_LOWER"

if [ -d "$NEW_SERVICE_DIR" ]; then
    echo "Error: Service '$SERVICE_LOWER' already exists at $NEW_SERVICE_DIR"
    exit 1
fi

echo "Creating core for service '$SERVICE_LOWER'..."

# Create directory structure
mkdir -p "$NEW_SERVICE_DIR/src/config"
mkdir -p "$NEW_SERVICE_DIR/src/database"
mkdir -p "$NEW_SERVICE_DIR/src/database/schemas"
mkdir -p "$NEW_SERVICE_DIR/src/database/seeders"
mkdir -p "$NEW_SERVICE_DIR/src/middlewares"
mkdir -p "$NEW_SERVICE_DIR/src/modules/health"
mkdir -p "$NEW_SERVICE_DIR/src/utils"
mkdir -p "$NEW_SERVICE_DIR/logs"

# Write package.json
cat <<EOF > "$NEW_SERVICE_DIR/package.json"
{
  "name": "$SERVICE_LOWER",
  "version": "1.0.0",
  "description": "",
  "license": "ISC",
  "author": "",
  "type": "commonjs",
  "main": "index.ts",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "ts-node -r tsconfig-paths/register src/server.ts",
    "dev": "nodemon -r tsconfig-paths/register src/server.ts"
  },
   "dependencies": {
    "cors": "^2.8.6",
    "drizzle-orm": "^0.45.1",
    "express": "^4.22.1",
    "express-rate-limit": "^8.2.1",
    "helmet": "^8.1.0",
    "morgan": "^1.10.1",
    "postgres": "^3.4.8",
    "winston": "^3.19.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.6",
    "@types/morgan": "^1.9.10",
    "dotenv": "^17.3.1",
    "drizzle-kit": "^0.31.9",
    "nodemon": "^3.1.11",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "tsx": "^4.21.0"
  }
}
EOF

# Write tsconfig.json
cat <<EOF > "$NEW_SERVICE_DIR/tsconfig.json"
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": [
      "ES2022"
    ],
    "declaration": true,
    "sourceMap": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "rootDir": ".",
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ],
      "@$SERVICE_LOWER/*": [
        "./src/*"
      ]
    }
  },
  "exclude": [
    "node_modules",
    "dist"
  ]
}
EOF

# Write src/server.ts
cat <<EOF > "$NEW_SERVICE_DIR/src/server.ts"
import 'dotenv/config';
import { app } from '@$SERVICE_LOWER/app';
import { connectDB } from '@$SERVICE_LOWER/database/$SERVICE_LOWER.connection';
import { config } from '@$SERVICE_LOWER/config/$SERVICE_LOWER.config';
import { logger } from '@$SERVICE_LOWER/utils/logger';

const start = async () => {
  logger.info(\`Starting \${config.service.name} Service...\`);

  await connectDB();

  const port = config.service.port || process.env.PORT || 3000;
  const server = app.listen(port, () => {
    logger.info(\`\${config.service.name} service listening on port \${port}\`);

    import('./utils/self-health-check').then(({ startSelfHealthCheck }) => {
      startSelfHealthCheck(\`http://localhost:\${port}/health\`);
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
EOF
# Fix literals in server.ts (bash interprets $[...])
sed -i 's/\$\[/{/g' "$NEW_SERVICE_DIR/src/server.ts"
sed -i 's/\]/}/g' "$NEW_SERVICE_DIR/src/server.ts"

# Write src/app.ts
cat <<EOF > "$NEW_SERVICE_DIR/src/app.ts"
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { json } from 'body-parser';
import morgan from 'morgan';
import { errorHandler, NotFoundError } from '@workspace/common';
import { auditLogger } from '@$SERVICE_LOWER/middlewares/$SERVICE_LOWER.audit-logger';
import { rateLimiter } from '@$SERVICE_LOWER/middlewares/$SERVICE_LOWER.rate-limiter';
import { healthRouter } from '@$SERVICE_LOWER/modules/health/health.routes';

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
EOF

# Write src/config/service.config.ts
cat <<EOF > "$NEW_SERVICE_DIR/src/config/$SERVICE_LOWER.config.ts"
import path from 'path';
import dotenv from 'dotenv';

// Load root .env if not already loaded (though typically passed by runner or docker)
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const getDatabaseUrl = () => {
  const url = process.env.${SERVICE_UPPER}_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL or ${SERVICE_UPPER}_DATABASE_URL environment variable is not set');
  }
  return url;
};

export const config = {
  service: {
    name: '$SERVICE_LOWER',
    port: process.env.PORT || 3000,
  },
  database: {
    url: getDatabaseUrl(),
  },
};
EOF

# Write src/database/service.connection.ts
cat <<EOF > "$NEW_SERVICE_DIR/src/database/$SERVICE_LOWER.connection.ts"
import { connectDB as connectSharedDB, SQL } from '@workspace/common';
import { config } from '@$SERVICE_LOWER/config/$SERVICE_LOWER.config';
import { logger } from '@$SERVICE_LOWER/utils/logger';

export const sql: SQL = connectSharedDB(process.env.${SERVICE_UPPER}_DATABASE_URL! || config.database.url);

export const connectDB = async () => {
  try {
    await sql\`SELECT 1\`;
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Database connection failed', error);
    process.exit(1);
  }
};

export default sql;
EOF


cat <<EOF > "$NEW_SERVICE_DIR/src/database/drizzle.config.ts"
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
EOF
cat <<EOF > "$NEW_SERVICE_DIR/src/database/seeds.execution.ts"
import { connectDB } from './$SERVICE_LOWER.connection';
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
EOF

cat <<EOF > "$NEW_SERVICE_DIR/src/database/seeders/index.ts"
export async function runAllSeeders() {}
EOF


cat <<EOF > "$NEW_SERVICE_DIR/src/database/schemas/enums.schema.ts"
// Your enums will go here
export const enums = {};
EOF

cat <<EOF > "$NEW_SERVICE_DIR/src/database/schemas/index.ts"
export * from './enums.schema';
EOF

# Write src/utils/logger.ts
cat <<EOF > "$NEW_SERVICE_DIR/src/utils/logger.ts"
import winston from 'winston';

export const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});
EOF

# Write src/utils/self-health-check.ts
cat <<EOF > "$NEW_SERVICE_DIR/src/utils/self-health-check.ts"
import http from 'http';

export const startSelfHealthCheck = (url: string, intervalMs: number = 30000) => {
  let failureCount = 0;
  const maxRetries = 3;

  const checkHealth = () => {
    const req = http.get(url, (res) => {
      const { statusCode } = res;
      if (statusCode === 200) {
        failureCount = 0;
        // Consume response data to free up memory
        res.resume();
      } else {
        handleFailure(\`Health check returned status \${statusCode}\`);
      }
    });

    req.on('error', (e) => {
      handleFailure(e.message);
    });

    req.end();
  };

  const handleFailure = (message: string) => {
    failureCount++;
    console.error(\`Self-health check failed (\${failureCount}/\${maxRetries}): \${message}\`);

    if (failureCount >= maxRetries) {
      console.error('Max retries reached. Shutting down server due to health check failure.');
      process.exit(1);
    }
  };

  // Initial check after a short delay
  setTimeout(() => {
    checkHealth();
    setInterval(checkHealth, intervalMs);
  }, 5000);
};
EOF

# Write src/middlewares/service.audit-logger.ts
cat <<EOF > "$NEW_SERVICE_DIR/src/middlewares/$SERVICE_LOWER.audit-logger.ts"
import { Request, Response, NextFunction } from 'express';
import winston from 'winston';
import path from 'path';

const localLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return \`\${timestamp} [\${level}]: \${message} \${Object.keys(meta).length ? JSON.stringify(meta) : ''}\`;
        })
      ),
    }),
    new winston.transports.File({
      filename: path.join(__dirname, \`../../logs/\${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}-server.log\`),
      level: 'info'
    })
  ],
});

export const auditLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    localLogger.info({
      message: 'Audit Log',
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: \`\${duration}ms\`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
  });
  next();
};
EOF

# Write src/middlewares/service.rate-limiter.ts
cat <<EOF > "$NEW_SERVICE_DIR/src/middlewares/$SERVICE_LOWER.rate-limiter.ts"
import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many requests from this IP, please try again later.',
  },
  validate: { trustProxy: false },
});
EOF

# Write src/modules/health/health.service.ts
cat <<EOF > "$NEW_SERVICE_DIR/src/modules/health/health.service.ts"
import { connectDB } from "@$SERVICE_LOWER/database/$SERVICE_LOWER.connection";

export class HealthService {
  async check(): Promise<boolean> {
    await connectDB();
    return true;
  }
}
EOF

# Write src/modules/health/health.controller.ts
cat <<EOF > "$NEW_SERVICE_DIR/src/modules/health/health.controller.ts"
import { Request, Response } from 'express';
import { sendSuccess } from '@workspace/common';
import { HealthService } from './health.service';

const healthService = new HealthService();

export class HealthController {
  async getHealth(req: Request, res: Response) {
    let retries = 3;
    while (retries > 0) {
      try {
        await healthService.check();
        return sendSuccess(res, { status: 'ok', timestamp: new Date().toISOString() }, 'Health check successful');
      } catch (error) {
        console.error(\`Health check failed, retrying... (\${retries} attempts left)\`);
        retries--;
        if (retries === 0) {
          throw error; // Let the global error handler handle it
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
}
EOF

# Write src/modules/health/health.routes.ts
cat <<EOF > "$NEW_SERVICE_DIR/src/modules/health/health.routes.ts"
import { Router } from 'express';
import { HealthController } from './health.controller';

const router: Router = Router();
const healthController = new HealthController();

router.get('/', healthController.getHealth);

export { router as healthRouter };
EOF

echo "--------------------------------------------------"
echo "Independent Service '$SERVICE_LOWER' created successfully at apps/$SERVICE_LOWER"
echo "--------------------------------------------------"
echo "Next steps:"
echo "1. Verify 'apps/$SERVICE_LOWER' content"
echo "2. Run 'npm install' in 'apps/$SERVICE_LOWER'"
echo "3. Add scripts to root 'package.json' if needed"
echo "4. Update your .env file with ${SERVICE_UPPER}_DATABASE_URL"
echo "5. Dont forgot to register ${SERVICE_LOWER} in src/monolith.ts"
echo "--------------------------------------------------"
