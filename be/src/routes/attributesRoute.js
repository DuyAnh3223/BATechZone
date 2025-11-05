import express from 'express';
import { createAttribute,getAttribute,updateAttribute, deleteAttribute,listAttributes,getAttributesByType } from '../controllers/attributeController.js';
import {createAttributeValue,getAttributeValue,updateAttributeValue,deleteAttributeValue,listAttributeValues,getAttributeValues} from '../controllers/attributeController.js';
const router = express.Router();

router.get('/', listAttributes);
router.get('/:id', getAttribute);
router.post('/', createAttribute);
router.put('/:id', updateAttribute);
router.delete('/:attributeName', deleteAttribute);

router.get('/values', listAttributeValues);
router.get('/:attributeId/values', getAttributeValue);
router.post('/values', createAttributeValue);
router.put('/values/:id', updateAttributeValue);
router.delete('/values/:id', deleteAttributeValue);

export default router;