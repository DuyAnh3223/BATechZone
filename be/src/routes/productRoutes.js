import express from 'express';
import { createProduct,getProduct,updateProduct, deleteProduct,listProducts,increaseProductView} from '../controllers/productController.js';
const router = express.Router();


router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.put('/:id/view', increaseProductView);


export default router;