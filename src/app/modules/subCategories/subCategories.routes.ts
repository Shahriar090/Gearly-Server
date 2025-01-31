import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import { subCategoryControllers } from './subCategories.controllers';
const router = express.Router();

router
  .route('/create-sub-category')
  .post(auth(USER_ROLES.Admin), subCategoryControllers.createSubCategory);

export const subCategoryRoutes = router;
