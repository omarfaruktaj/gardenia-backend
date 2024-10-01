import { Router } from 'express';
import { initiatePaymentController } from './paymentController';

const router = Router();

router.post('/initiate', initiatePaymentController);

export default router;
