import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export function FeedbackSubmissionSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    comment: '',
    company: '',
    role: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const apiBase = import.meta.env.VITE_API_URL || '/api';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Client-side validation
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }
      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error('Valid email is required');
      }
      if (formData.comment.trim().length < 10) {
        throw new Error('Comment must be at least 10 characters');
      }

      const response = await fetch(`${apiBase}/feedback/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || 'Failed to submit feedback');
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        rating: 5,
        comment: '',
        company: '',
        role: '',
      });

      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message || 'Error submitting feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container content-section">
      <h2>Share Your Feedback</h2>
      <p style={{ textAlign: 'center', marginBottom: '2rem', opacity: 0.8 }}>
        Help us improve by sharing your experience with CyberNova
      </p>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="feedback-form"
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '2rem',
          borderRadius: '12px',
          background: 'rgba(0, 212, 255, 0.03)',
          border: '1px solid rgba(0, 212, 255, 0.2)',
        }}
      >
        {success && (
          <div
            style={{
              padding: '1rem',
              marginBottom: '1.5rem',
              background: 'rgba(0, 255, 136, 0.1)',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              borderRadius: '8px',
              color: '#00ff88',
              textAlign: 'center',
            }}
          >
            ✓ Thank you! Your feedback has been submitted successfully.
          </div>
        )}

        {error && (
          <div
            style={{
              padding: '1rem',
              marginBottom: '1.5rem',
              background: 'rgba(255, 68, 68, 0.1)',
              border: '1px solid rgba(255, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#ff4444',
            }}
          >
            ✗ {error}
          </div>
        )}

        {/* Name */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Name *
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'rgba(0, 212, 255, 0.05)',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              borderRadius: '6px',
              color: 'inherit',
              fontSize: 'inherit',
            }}
            disabled={loading}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Email *
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@company.com"
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'rgba(0, 212, 255, 0.05)',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              borderRadius: '6px',
              color: 'inherit',
              fontSize: 'inherit',
            }}
            disabled={loading}
          />
        </div>

        {/* Company & Role */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label htmlFor="company" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Company
            </label>
            <input
              id="company"
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Your company"
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(0, 212, 255, 0.05)',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: '6px',
                color: 'inherit',
                fontSize: 'inherit',
              }}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="role" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Role
            </label>
            <input
              id="role"
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="Your role"
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(0, 212, 255, 0.05)',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: '6px',
                color: 'inherit',
                fontSize: 'inherit',
              }}
              disabled={loading}
            />
          </div>
        </div>

        {/* Rating */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 500 }}>
            Rating *
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                disabled={loading}
                style={{
                  fontSize: '1.75rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  opacity: star <= formData.rating ? 1 : 0.4,
                  transition: 'opacity 0.2s',
                  color: '#00d4ff',
                }}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="comment" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Your Feedback *
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Tell us about your experience with CyberNova..."
            rows="5"
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'rgba(0, 212, 255, 0.05)',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              borderRadius: '6px',
              color: 'inherit',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
            disabled={loading}
          />
          <small style={{ opacity: 0.7 }}>
            {formData.comment.length} characters (minimum 10 required)
          </small>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem 1.5rem',
            background: loading ? 'rgba(0, 212, 255, 0.3)' : 'rgba(0, 212, 255, 0.15)',
            border: '1px solid rgba(0, 212, 255, 0.5)',
            borderRadius: '6px',
            color: '#00d4ff',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: 600,
          }}
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </motion.form>
    </section>
  );
}
