import express from 'express';
import { feedbackController } from '../controllers/feedbackController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public endpoints
router.post('/submit', feedbackController.submit); // Submit feedback without login
router.get('/approved', feedbackController.getApproved); // Get approved feedback for display

// Admin endpoints
router.get('/', requireAdminAuth, feedbackController.getAll); // Get all feedback
router.get('/:id', requireAdminAuth, feedbackController.getById); // Get single feedback
router.patch('/:id/status', requireAdminAuth, feedbackController.updateStatus); // Update feedback status
router.patch('/:id', requireAdminAuth, feedbackController.update); // Edit feedback
router.delete('/:id', requireAdminAuth, feedbackController.delete); // Delete feedback

export default router;
