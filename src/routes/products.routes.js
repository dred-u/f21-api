import { Router } from "express";
import * as productsController  from '../controllers/products.controller.js'
import upload from '../middlewares/upload.middleware.js';

const router = Router();

router.get('/products', productsController.getProducts);
router.get('/products/:id', productsController.getProduct);
router.post('/products', upload.single('imagen'), productsController.postProduct);
router.patch('/products/:id', productsController.updateProduct);
router.delete('/products/:id', productsController.deleteProduct);

router.get('/store_products/:id', productsController.getProductsByStore);
router.patch('/store_products/:id_sucursal', productsController.updateProductsInStore);
router.post('/store_products/', upload.single('imagen'), productsController.addProductToStore);
router.delete('/store_products/:id', productsController.removeProductFromStore);   

router.post('/verificate', productsController.verificate);
router.post('/capture', productsController.capture);
router.get('/verificate/:id_sucursal', productsController.getVerificationsByStore);
router.get('/capture/:id_sucursal', productsController.getCapturesByStore)



export default router