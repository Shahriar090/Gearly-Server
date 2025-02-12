import express, { NextFunction, Request, Response } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { categoryValidations } from './category.validations';
import { categoryControllers } from './category.controllers';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import { upload } from '../../utils/sendImageToCloudinary';
const router = express.Router();

// create category
router.route('/create-category').post(
  auth(USER_ROLES.Admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
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

// delete a category
router
  .route('/:id')
  .delete(auth(USER_ROLES.Admin), categoryControllers.deleteCategory);

// restore a deleted category
router
  .route('/:id')
  .patch(auth(USER_ROLES.Admin), categoryControllers.restoreDeletedCategory);
// ---------------------------------
export const categoryRoutes = router;
