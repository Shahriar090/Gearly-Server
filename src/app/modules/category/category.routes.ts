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

// ---------------------------------
export const categoryRoutes = router;
