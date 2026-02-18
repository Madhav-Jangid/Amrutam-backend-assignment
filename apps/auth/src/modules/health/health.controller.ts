import { Request, Response } from 'express';
import { sendSuccess, logger } from '@workspace/common';
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
        console.error(`Health check failed, retrying... (${retries} attempts left)`);
        retries--;
        if (retries === 0) {
          throw error; // Let the global error handler handle it
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
}
