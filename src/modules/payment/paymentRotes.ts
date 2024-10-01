import { Router } from 'express';
import {
  confirmPaymentController,
  initiatePaymentController,
} from './paymentController';

const router = Router();

router.post('/initiate', initiatePaymentController);
router.post('/confirm', confirmPaymentController);

export default router;
