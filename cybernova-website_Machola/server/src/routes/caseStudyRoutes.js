import express from 'express';
import { requireAdminAuth } from '../middleware/authMiddleware.js';
import { getCaseStudies, createCaseStudy, updateCaseStudy, deleteCaseStudy } from '../controllers/caseStudyController.js';

const router = express.Router();

router.get('/', getCaseStudies);
router.post('/', requireAdminAuth, createCaseStudy);
router.patch('/:id', requireAdminAuth, updateCaseStudy);
router.delete('/:id', requireAdminAuth, deleteCaseStudy);

export default router;
