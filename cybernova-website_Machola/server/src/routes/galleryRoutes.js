import express from 'express';
import { galleryController } from '../controllers/galleryController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';
import { uploadGalleryImage } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public endpoints
router.get('/', galleryController.getAll); // Get all gallery items

// Admin endpoints
router.post('/', requireAdminAuth, galleryController.create); // Create gallery item (URL-based)
router.post('/upload', requireAdminAuth, uploadGalleryImage.single('image'), galleryController.upload); // Upload image file
router.get('/:id', galleryController.getById); // Get single gallery item (public)
router.patch('/:id', requireAdminAuth, galleryController.update); // Update gallery item
router.delete('/:id', requireAdminAuth, galleryController.delete); // Delete gallery item

export default router;
