import { FeedbackModel } from '../models/feedbackModel.js';

// Validation helpers
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateRating(rating) {
  const num = parseInt(rating, 10);
  return num >= 1 && num <= 5;
}

export const feedbackController = {
  // Submit new feedback
  async submit(req, res) {
    try {
      const { name, email, rating, comment, company, role } = req.body;

      // Validation
      if (!name || !name.trim()) {
        return res.status(400).json({ message: 'Name is required' });
      }
      if (!email || !validateEmail(email)) {
        return res.status(400).json({ message: 'Valid email is required' });
      }
      if (!rating || !validateRating(rating)) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
      }
      if (!comment || comment.trim().length < 10) {
        return res.status(400).json({ message: 'Comment must be at least 10 characters' });
      }

      const payload = {
        name: name.trim(),
        email: email.trim(),
        rating: parseInt(rating, 10),
        comment: comment.trim(),
        company: company ? company.trim() : null,
        role: role ? role.trim() : null,
      };

      const feedback = await FeedbackModel.createFeedback(payload);
      res.status(201).json(feedback);
    } catch (err) {
      res.status(500).json({ message: err.message || 'Error creating feedback' });
    }
  },

  // Get all feedback (admin only)
  async getAll(req, res) {
    try {
      const feedback = await FeedbackModel.getAllFeedback();
      res.json(feedback);
    } catch (err) {
      res.status(500).json({ message: err.message || 'Error fetching feedback' });
    }
  },

  // Get approved feedback only (public)
  async getApproved(req, res) {
    try {
      const feedback = await FeedbackModel.getAllFeedback(true);
      res.json(feedback);
    } catch (err) {
      res.status(500).json({ message: err.message || 'Error fetching feedback' });
    }
  },

  // Get single feedback by ID (admin)
  async getById(req, res) {
    try {
      const { id } = req.params;
      const feedback = await FeedbackModel.getFeedbackById(id);
      if (!feedback) {
        return res.status(404).json({ message: 'Feedback not found' });
      }
      res.json(feedback);
    } catch (err) {
      res.status(500).json({ message: err.message || 'Error fetching feedback' });
    }
  },

  // Update feedback status (admin only)
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      const feedback = await FeedbackModel.updateFeedback(id, { status });
      res.json(feedback);
    } catch (err) {
      res.status(500).json({ message: err.message || 'Error updating feedback' });
    }
  },

  // Update feedback (admin only)
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, email, rating, comment, company, role } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({ message: 'Name is required' });
      }
      if (!email || !validateEmail(email)) {
        return res.status(400).json({ message: 'Valid email is required' });
      }
      if (!rating || !validateRating(rating)) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
      }
      if (!comment || comment.trim().length < 10) {
        return res.status(400).json({ message: 'Comment must be at least 10 characters' });
      }

      const updates = {
        name: name.trim(),
        email: email.trim(),
        rating: parseInt(rating, 10),
        comment: comment.trim(),
        company: company ? company.trim() : null,
        role: role ? role.trim() : null,
      };

      const feedback = await FeedbackModel.updateFeedback(id, updates);
      res.json(feedback);
    } catch (err) {
      res.status(500).json({ message: err.message || 'Error updating feedback' });
    }
  },

  // Delete feedback (admin only)
  async delete(req, res) {
    try {
      const { id } = req.params;
      await FeedbackModel.deleteFeedback(id);
      res.json({ message: 'Feedback deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message || 'Error deleting feedback' });
    }
  },
};
