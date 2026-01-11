import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import { subCategoryControllers } from './subCategories.controllers';
import validateRequest from '../../middlewares/validateRequest';
import { subCategoryValidations } from './subCategories.validations';
import { upload } from '../../utils/sendImageToCloudinary';
import { parseFormData } from '../../utils/parseFormData';
const router = express.Router();

// create
router.route('/create-sub-category').post(
	auth(USER_ROLES.Admin),
	upload.single('image'),
	parseFormData,
	validateRequest(subCategoryValidations.createSubCategoryValidationSchema),

	subCategoryControllers.createSubCategory,
);

// get all
router.route('/').get(subCategoryControllers.getAllSubCategoriesWithProductCount);

// get single
router.route('/get-single-sub-category/:id').get(auth(USER_ROLES.Admin), subCategoryControllers.getSubCategoryFromDb);

// update a sub category
router
	.route('/update-sub-category/:id')
	.put(
		validateRequest(subCategoryValidations.createSubCategoryValidationSchema),
		auth(USER_ROLES.Admin),
		subCategoryControllers.updateSubCategory,
	);

// get sub category by category
router.route('/sub-category-by-category').get(subCategoryControllers.getSubCategoryByCategory);

// delete a sub category
router.route('/:id').delete(auth(USER_ROLES.Admin), subCategoryControllers.deleteSubCategory);

// -----------------------------------------------------------------------
export const subCategoryRoutes = router;
