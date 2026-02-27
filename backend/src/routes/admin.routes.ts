import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import * as adminController from '../controllers/admin.controller';
import { validate } from '../middleware/validation.middleware';
import { body } from 'express-validator';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/applications', adminController.listAllApplications);
router.put(
  '/applications/:id/status',
  validate([
    body('status').isIn(['submitted', 'under_review', 'accepted', 'rejected']),
    body('comment').optional().isString(),
  ]),
  adminController.updateApplicationStatus
);

export default router;