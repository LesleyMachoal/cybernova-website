import { Router } from 'express';
import { createInquiry, getInquiries, patchInquiryStatus, deleteInquiry } from '../controllers/inquiryController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const inquiryRouter = Router();

inquiryRouter.post('/', createInquiry);
inquiryRouter.get('/', requireAdminAuth, getInquiries);
inquiryRouter.patch('/:id/status', requireAdminAuth, patchInquiryStatus);
inquiryRouter.delete('/:id', requireAdminAuth, deleteInquiry);

export default inquiryRouter;
