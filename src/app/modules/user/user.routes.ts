import express from 'express';
import { userControllers } from './user.controllers';

const router = express.Router();
// create user
router.route('/users/create-user').post(userControllers.createUser);

export const userRoutes = router;
