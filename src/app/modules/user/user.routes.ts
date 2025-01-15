import express from 'express';
import { userControllers } from './user.controllers';

const router = express.Router();
// create admin
router.route('/users/create-admin').post(userControllers.createAdmin);

export const userRoutes = router;
