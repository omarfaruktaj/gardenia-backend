import { Router } from 'express';
import authorizeWithRoles from '../../middlewares/authorizeWithRoles';
import {
  createQuoteController,
  deleteQuoteController,
  getAllQuotesController,
  getAQuoteController,
  getRandomQuoteController,
  updateQuoteController,
} from './quoteController';

const router = Router();

router
  .route('/')
  .get(getAllQuotesController)
  .post(authorizeWithRoles('admin'), createQuoteController);

router.route('/random').get(getRandomQuoteController);

router
  .route('/:id')
  .get(getAQuoteController)
  .put(authorizeWithRoles('admin'), updateQuoteController)
  .delete(authorizeWithRoles('admin'), deleteQuoteController);

export default router;
