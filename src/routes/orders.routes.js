import { Router } from "express";
import * as ordersController from '../controllers/orders.controller.js'

const router = Router();

router.get('/orders', ordersController.getOrders);
router.get('/orders/:id', ordersController.getOrder);
router.get('/store_orders/:id', ordersController.getStoreOrders);
router.post('/orders', ordersController.postOrder);
router.patch('/orders/:id', ordersController.updateOrder);
router.delete('/orders/:id', ordersController.deleteOrder);

router.get('/order_details/:id', ordersController.getOrderDetails);
router.post('/order_details/', ordersController.postOrderDetails);
router.patch('/order_details/:id', ordersController.updateOrderDetails);


export default router