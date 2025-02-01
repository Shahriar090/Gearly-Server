import express from 'express';
import { productControllers } from './productModel.controllers';
import validateRequest from '../../middlewares/validateRequest';
import { productValidations } from './productModel.validations';
const router = express.Router();

router
  .route('/create-product')
  .post(
    validateRequest(productValidations.createProductValidationSchema),
    productControllers.createProduct,
  );
// ---------------------------------
export const productRoutes = router;
