import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import { subCategoryControllers } from './subCategories.controllers';
import validateRequest from '../../middlewares/validateRequest';
import { subCategoryValidations } from './subCategories.validations';
const router = express.Router();

// create
router
  .route('/create-sub-category')
  .post(
    validateRequest(subCategoryValidations.createSubCategoryValidationSchema),
    auth(USER_ROLES.Admin),
    subCategoryControllers.createSubCategory,
  );

// get all
router
  .route('/')
  .get(auth(USER_ROLES.Admin), subCategoryControllers.getAllSubCategories);

// get single
router
  .route('/:id')
  .get(auth(USER_ROLES.Admin), subCategoryControllers.getSubCategoryFromDb);

// update a sub category
router
  .route('/:id')
  .put(
    validateRequest(subCategoryValidations.createSubCategoryValidationSchema),
    auth(USER_ROLES.Admin),
    subCategoryControllers.updateSubCategory,
  );

// delete a sub category
router
  .route('/:id')
  .delete(auth(USER_ROLES.Admin), subCategoryControllers.deleteSubCategory);
// -----------------------------------------------------------------------
export const subCategoryRoutes = router;
