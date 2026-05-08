import { GalleryModel } from '../models/galleryModel.js';

export const galleryController = {
  // Upload gallery image file
  async upload(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      const { title, description, category } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({ message: 'Title is required' });
      }

      // Generate URL path for the uploaded file
      const image_url = `uploads/gallery/${req.file.filename}`;

      const payload = {
        image_url,
        title: title.trim(),
        description: description ? description.trim() : null,
        category: category || 'workshop',
      };

      const item = await GalleryModel.createGalleryItem(payload);
      res.status(201).json(item);
    } catch (err) {
      res.status(500).json({ message: err.message || 'Error uploading gallery image' });
    }
  },

  // Create gallery item
  async create(req, res) {
    try {
      const { image_url, title, description, category } = req.body;

      if (!image_url) {
        return res.status(400).json({ message: 'Image URL is required' });
      }
      if (!title || !title.trim()) {
        return res.status(400).json({ message: 'Title is required' });
      }

      const payload = {
        image_url: image_url.trim(),
        title: title.trim(),
        description: description ? description.trim() : null,
        category: category || 'workshop',
      };

      const item = await GalleryModel.createGalleryItem(payload);
      res.status(201).json(item);
    } catch (err) {
      res.status(500).json({ message: err.message || 'Error creating gallery item' });
    }
  },

  // Get all gallery items
  async getAll(req, res) {
    try {
      const items = await GalleryModel.getAllGalleryItems();
      res.json(items);
    } catch (err) {
      res.status(500).json({ message: err.message || 'Error fetching gallery items' });
    }
  },

  // Get single gallery item
  async getById(req, res) {
    try {
      const { id } = req.params;
      const item = await GalleryModel.getGalleryItemById(id);
      if (!item) {
        return res.status(404).json({ message: 'Gallery item not found' });
      }
      res.json(item);
    } catch (err) {
      res.status(500).json({ message: err.message || 'Error fetching gallery item' });
    }
  },

  // Update gallery item
  async update(req, res) {
    try {
      const { id } = req.params;
      const { image_url, title, description, category } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({ message: 'Title is required' });
      }

      const updates = {
        title: title.trim(),
        description: description ? description.trim() : null,
        category: category || 'workshop',
      };

      if (image_url) {
        updates.image_url = image_url.trim();
      }

      const item = await GalleryModel.updateGalleryItem(id, updates);
      res.json(item);
    } catch (err) {
      res.status(500).json({ message: err.message || 'Error updating gallery item' });
    }
  },

  // Delete gallery item
  async delete(req, res) {
    try {
      const { id } = req.params;
      await GalleryModel.deleteGalleryItem(id);
      res.json({ message: 'Gallery item deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message || 'Error deleting gallery item' });
    }
  },
};
