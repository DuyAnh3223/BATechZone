import express from 'express';
import {createCategory,deleteCategory,listCategories} from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', listCategories);
router.post('/', createCategory);
router.delete('/:id', deleteCategory);

export default router;