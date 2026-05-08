import express from 'express';
import { requireAdminAuth } from '../middleware/authMiddleware.js';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';

const router = express.Router();

router.get('/', getEvents);
router.post('/', requireAdminAuth, createEvent);
router.patch('/:id', requireAdminAuth, updateEvent);
router.delete('/:id', requireAdminAuth, deleteEvent);

export default router;
