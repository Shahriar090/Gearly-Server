import express from 'express';
import { userControllers } from './user.controllers';

const router = express.Router();
// create user
router.route('/create-user').post(userControllers.createUser);
// get all users
router.route('/').get(userControllers.getAllUsers);
// get single user
router.route('/:id').get(userControllers.getSingleUser);
// update a user
router.route('/:id').put(userControllers.updateUser);
// delete a user
router.route('/:id').delete(userControllers.deleteUser);

export const userRoutes = router;
