import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { parseFormData } from '../../utils/parseFormData';
import { upload } from '../../utils/sendImageToCloudinary';
import { productControllers } from './productModel.controllers';
import { productValidations } from './productModel.validations';
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
		upload.array('images', 5),
		parseFormData,
		validateRequest(productValidations.createProductValidationSchema),
		productControllers.createProduct,
	);

// get all products
router.route('/').get(productControllers.getAllProducts);

// get a single product
router.route('/product/:id').get(productControllers.getSingleProduct);

// update a product
router
	.route('/update-product/:id')
	.put(validateRequest(productValidations.updateProductValidationSchema), productControllers.updateProduct);

// delete a product
router.route('/delete-product/:id').delete(productControllers.deleteProduct);

// get products by category slug
router.route('/category/:slug').get(productControllers.getProductByCategorySlug);
// ---------------------------------
export const productRoutes = router;
