import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { body } from 'express-validator';

const router = Router();

router.post(
  '/register',
  validate([
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').notEmpty(),
    body('lastName').notEmpty(),
  ]),
  register
);
router.post('/login', login);

export default router;