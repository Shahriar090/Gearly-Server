import express from 'express';
import { userControllers } from './user.controllers';

const router = express.Router();
// create user
router.route('/users/create-user').post(userControllers.createUser);
router.route('/users').get(userControllers.getAllUsers);

export const userRoutes = router;
