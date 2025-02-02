import express from 'express';
import { productControllers } from './productModel.controllers';
import validateRequest from '../../middlewares/validateRequest';
import { productValidations } from './productModel.validations';
const router = express.Router();

// create a product
router
  .route('/create-product')
  .post(
    validateRequest(productValidations.createProductValidationSchema),
    productControllers.createProduct,
  );

// get all products
router.route('/').get(productControllers.getAllProducts);

// get a single product
router.route('/:id').get(productControllers.getSingleProduct);
// ---------------------------------
export const productRoutes = router;
