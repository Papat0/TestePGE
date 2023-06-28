import { Router } from 'express';
import main from './routesMain';

const router: Router = Router();
router.use('/', main);

export default router;