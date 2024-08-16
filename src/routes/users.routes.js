import { Router } from "express";
import * as usersController from '../controllers/users.controller.js';
import authRequired from '../middlewares/validate.token.js';

const router = Router();

router.post('/register', usersController.register);
router.post('/login', usersController.login);
router.post('/verify', authRequired, usersController.verifyToken);
router.patch('/user/:id', usersController.updateUser);
router.get('/users/', usersController.getUsers);

export default router