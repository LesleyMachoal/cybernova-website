import express from 'express';
import { requireAdminAuth } from '../middleware/authMiddleware.js';
import { getServices, createService, updateService, deleteService } from '../controllers/serviceController.js';

const router = express.Router();

router.get('/', getServices);
router.post('/', requireAdminAuth, createService);
router.patch('/:id', requireAdminAuth, updateService);
router.delete('/:id', requireAdminAuth, deleteService);

export default router;
