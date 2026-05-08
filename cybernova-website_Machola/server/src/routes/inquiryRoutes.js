import { Router } from 'express';
import { feedbackController } from '../controllers/feedbackController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

// Treat legacy /api/inquiries as feedback endpoints (consolidation)
const inquiryRouter = Router();

// Public: submit feedback via legacy inquiries POST
inquiryRouter.post('/', feedbackController.submit);

// Admin: list / manage feedback via inquiries admin endpoints
inquiryRouter.get('/', requireAdminAuth, feedbackController.getAll);
inquiryRouter.patch('/:id/status', requireAdminAuth, feedbackController.updateStatus);
inquiryRouter.delete('/:id', requireAdminAuth, feedbackController.delete);

export default inquiryRouter;
