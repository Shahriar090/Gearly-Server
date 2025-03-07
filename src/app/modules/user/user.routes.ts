import express, { NextFunction, Request, Response } from 'express';
import { userControllers } from './user.controllers';
import validateRequest from '../../middlewares/validateRequest';
import { userValidations } from './user.validations';
import auth from '../../middlewares/auth';
import { USER_ROLES } from './user.constant';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();
// create user
router.route('/create-user').post(
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const bodyData = JSON.parse(req.body.data);

      req.body = { user: bodyData.user };
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Invalid JSON data',
        error,
      });
    }
  },
  validateRequest(userValidations.createUserValidationSchema), // Validate the 'user' field
  userControllers.createUser, // Handle user creation
);
// get all users
router.route('/').get(auth(USER_ROLES.Admin), userControllers.getAllUsers);
// get single user
router.route('/get-single-user/:id').get(userControllers.getSingleUser);
// update a user
router
  .route('/update-user/:id')
  .put(
    validateRequest(userValidations.updateUserValidationSchema),
    userControllers.updateUser,
  );
// delete a user
router.route('/delete-user/:id').delete(userControllers.deleteUser);

// user profile
router
  .route('/profile')
  .get(
    auth(USER_ROLES.Admin, USER_ROLES.Customer),
    userControllers.getUserProfile,
  );

export const userRoutes = router;
