import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { authValidations } from './auth.validations';
import { authControllers } from './auth.controllers';
const router = express.Router();

// login
router
  .route('/login')
  .post(
    validateRequest(authValidations.loginUserValidationSchema),
    authControllers.loginUser,
  );

export const authRoutes = router;
