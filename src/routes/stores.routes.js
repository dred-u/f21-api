import { Router } from "express";
import * as storesController from '../controllers/stores.controller.js';
import authRequired from '../middlewares/validate.token.js';

const router = Router();

router.get('/stores', storesController.getStores);
router.get('/stores/:id', storesController.getStore);
router.post('/stores', storesController.postStore);
router.patch('/stores/:id', storesController.updateStore);
router.delete('/stores/:id', storesController.deleteStore);

router.get('/store_users/:id', storesController.getUsersByStore);
router.get('/store_user/:id', storesController.getUserByStore);
router.post('/store_users/', storesController.addUserToStore);
router.delete('/store_users/:id', storesController.removeUserFromStore);

export default router