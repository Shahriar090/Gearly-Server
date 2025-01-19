import express from 'express';
import { userControllers } from './user.controllers';
import validateRequest from '../../middlewares/validateRequest';
import { userValidations } from './user.validations';
import auth from '../../middlewares/auth';
import { UserRoles } from './user.interface';

const router = express.Router();
// create user
router
  .route('/create-user')
  .post(
    validateRequest(userValidations.createUserValidationSchema),
    userControllers.createUser,
  );
// get all users
router.route('/').get(auth(UserRoles.Admin), userControllers.getAllUsers);
// get single user
router.route('/:id').get(userControllers.getSingleUser);
// update a user
router
  .route('/:id')
  .put(
    validateRequest(userValidations.updateUserValidationSchema),
    userControllers.updateUser,
  );
// delete a user
router.route('/:id').delete(userControllers.deleteUser);

export const userRoutes = router;
