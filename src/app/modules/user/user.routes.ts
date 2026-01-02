import express from 'express';
import { userControllers } from './user.controllers';
import validateRequest from '../../middlewares/validateRequest';
import { userValidations } from './user.validations';
import auth from '../../middlewares/auth';
import { USER_ROLES } from './user.constant';
import { upload } from '../../utils/sendImageToCloudinary';
import { parseFormData } from '../../utils/parseFormData';

const router = express.Router();
// create user
router
	.route('/create-user')
	.post(validateRequest(userValidations.createUserValidationSchema), userControllers.createUser);
// get all users
router.route('/').get(auth(USER_ROLES.Admin), userControllers.getAllUsers);
// get single user
router.route('/get-single-user/:id').get(userControllers.getSingleUser);
// update a user
router
	.route('/update-user/:id')
	.put(validateRequest(userValidations.updateUserValidationSchema), userControllers.updateUser);
// delete a user
router.route('/delete-user/:id').delete(userControllers.deleteUser);

// user profile
router.route('/profile').get(auth(USER_ROLES.Admin, USER_ROLES.Customer), userControllers.getUserProfile);

// upload profile picture
router
	.route('/profile-image')
	.patch(
		auth(USER_ROLES.Admin, USER_ROLES.Customer),
		upload.single('image'),
		parseFormData,
		userControllers.updateProfileImage,
	);

export const userRoutes = router;
