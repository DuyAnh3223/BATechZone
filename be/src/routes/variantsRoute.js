import express from 'express';
import { createVariant,getVariant,updateVariant, deleteVariant,listVariants} from '../controllers/variantController.js';
const router = express.Router();


router.get('/', listVariants);
router.get('/:id', getVariant);
router.post('/', createVariant);
router.put('/:id', updateVariant);
router.delete('/:id', deleteVariant);


export default router;