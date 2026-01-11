import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { parseFormData } from '../../utils/parseFormData';
import { upload } from '../../utils/sendImageToCloudinary';
import { USER_ROLES } from '../user/user.constant';
import { categoryControllers } from './category.controllers';
import { categoryValidations } from './category.validations';

const router = express.Router();

// create category
router
	.route('/create-category')
	.post(
		upload.single('image'),
		parseFormData,
		validateRequest(categoryValidations.createCategoryValidationSchema),
		categoryControllers.createCategory,
	);

// get all categories
router.route('/').get(auth(USER_ROLES.Customer, USER_ROLES.Admin), categoryControllers.getAllCategories);

// get single category
router.route('/:slug').get(categoryControllers.getCategory);

// update a category
router
	.route('/:id')
	.put(
		auth(USER_ROLES.Admin),
		validateRequest(categoryValidations.updateCategoryValidationSchema),
		categoryControllers.updateCategory,
	);

// delete a category
router.route('/:id').delete(auth(USER_ROLES.Admin), categoryControllers.deleteCategory);

// restore a deleted category
router.route('/:id').patch(auth(USER_ROLES.Admin), categoryControllers.restoreDeletedCategory);
// ---------------------------------
export const categoryRoutes = router;
