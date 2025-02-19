import express from 'express';
import { productControllers } from './productModel.controllers';
import validateRequest from '../../middlewares/validateRequest';
import { productValidations } from './productModel.validations';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
const router = express.Router();

// create a product
router
  .route('/create-product')
  .post(
    auth(USER_ROLES.Admin),
    validateRequest(productValidations.createProductValidationSchema),
    productControllers.createProduct,
  );

// get all products
router.route('/').get(productControllers.getAllProducts);

// get a single product
router.route('/:id').get(productControllers.getSingleProduct);

// update a product
router
  .route('/:id')
  .put(
    validateRequest(productValidations.updateProductValidationSchema),
    productControllers.updateProduct,
  );

// delete a product
router.route('/:id').delete(productControllers.deleteProduct);
// ---------------------------------
export const productRoutes = router;
