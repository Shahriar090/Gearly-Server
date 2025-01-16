import express from 'express';
import { userControllers } from './user.controllers';

const router = express.Router();
// create user
router.route('/users/create-user').post(userControllers.createUser);
// get all users
router.route('/users').get(userControllers.getAllUsers);
// get single user
router.route('/users/:id').get(userControllers.getSingleUser);
// update a user
router.route('/users/:id').put(userControllers.updateUser);
// delete a user
router.route('/users/:id').delete(userControllers.deleteUser);

export const userRoutes = router;
