import express from 'express';
import { createAttribute,getAttribute, deleteAttribute,listAttributes,getAttributesByType } from '../controllers/attributeController.js';
const router = express.Router();

router.get('/', listAttributes);
router.get('/:id', getAttribute);
router.post('/', createAttribute);
router.delete('/:id', deleteAttribute);


export default router;