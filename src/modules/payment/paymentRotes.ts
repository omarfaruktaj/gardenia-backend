import { Router } from 'express';
import authorizeWithRoles from '../../middlewares/authorizeWithRoles';
import {
  confirmPaymentController,
  getAllPaymentsController,
  getMonthlyPaymentsController,
  initiatePaymentController,
} from './paymentController';

const router = Router();

router.get(
  '/initiate',
  authorizeWithRoles('admin', 'user'),
  initiatePaymentController
);
router.post(
  '/confirm',
  authorizeWithRoles('admin', 'user'),
  confirmPaymentController
);
router.get('/', authorizeWithRoles('admin'), getAllPaymentsController);
router.get('/monthly-payments', getMonthlyPaymentsController);
export default router;
