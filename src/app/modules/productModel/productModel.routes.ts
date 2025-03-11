import express from 'express';
import { productControllers } from './productModel.controllers';
import validateRequest from '../../middlewares/validateRequest';
import { productValidations } from './productModel.validations';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import { upload } from '../../utils/sendImageToCloudinary';
import { parseFormData } from '../../utils/parseFormData';
const router = express.Router();

// const parseFormData = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): void => {
//   try {
//     if (req.body.data) {
//       req.body = JSON.parse(req.body.data);
//     }
//     next();
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     // Send the error response without returning it
//     res.status(400).json({
//       success: false,
//       message: 'Invalid JSON data in form-data',
//       error: error.message,
//     });
//   }
// };
// create a product
router
  .route('/create-product')
  .post(
    auth(USER_ROLES.Admin),
    upload.array('images', 5),
    parseFormData,
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
