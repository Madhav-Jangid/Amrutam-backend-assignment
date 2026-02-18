import { Router } from 'express';
import { HealthController } from './health.controller';

const router: Router = Router();
const healthController = new HealthController();

router.get('/', healthController.getHealth);

export { router as healthRouter };
