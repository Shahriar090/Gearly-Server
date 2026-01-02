import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { authValidations } from './auth.validations';
import { authControllers } from './auth.controllers';
const router = express.Router();

// login
router.route('/login').post(validateRequest(authValidations.loginUserValidationSchema), authControllers.loginUser);

// refresh token
router
	.route('/refresh-token')
	.post(validateRequest(authValidations.refreshTokenValidationSchema), authControllers.refreshToken);

// forget password
router
	.route('/forget-password')
	.post(validateRequest(authValidations.forgetPasswordValidationSchema), authControllers.forgetPassword);

// reset password
router
	.route('/reset-password')
	.post(validateRequest(authValidations.resetPasswordValidationSchema), authControllers.resetPassword);

export const authRoutes = router;
