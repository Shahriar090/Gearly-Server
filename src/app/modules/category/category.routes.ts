import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { categoryValidations } from './category.validations';
import { categoryControllers } from './category.controllers';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
const router = express.Router();

// create category
router
  .route('/create-category')
  .post(
    auth(USER_ROLES.Admin),
    validateRequest(categoryValidations.createCategoryValidationSchema),
    categoryControllers.createCategory,
  );

// get all categories
router
  .route('/')
  .get(auth(USER_ROLES.Admin), categoryControllers.getAllCategories);

// get single category
router
  .route('/:id')
  .get(auth(USER_ROLES.Admin), categoryControllers.getCategory);

// update a category
router
  .route('/:id')
  .put(
    auth(USER_ROLES.Admin),
    validateRequest(categoryValidations.updateCategoryValidationSchema),
    categoryControllers.updateCategory,
  );
// ---------------------------------
export const categoryRoutes = router;
