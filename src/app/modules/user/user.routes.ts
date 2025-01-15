import express from 'express';
import { userControllers } from './user.controllers';

const router = express.Router();
// create user
router.route('/users/create-user').post(userControllers.createUser);
// get all users
router.route('/users').get(userControllers.getAllUsers);
// get single user
router.route('/users/:id').get(userControllers.getSingleUser);

export const userRoutes = router;
