import express from 'express';
import {createAttributeValue,getAttributeValue,deleteAttributeValue,listAttributeValues,getAttributeValues} from '../controllers/attributeValueController.js';

const router = express.Router();

router.get('/', listAttributeValues);
router.get('/:attributeId/values', getAttributeValues);
router.post('/', createAttributeValue);
router.delete('/:id', deleteAttributeValue);

export default router;