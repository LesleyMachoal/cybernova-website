import { useState, useEffect } from 'react';

function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

export function ContactSection() {
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error | saved-local
  const [errorMsg, setErrorMsg] = useState('');
  const [errors, setErrors] = useState({});
  const apiBase = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    let t;
    if (status === 'success') t = setTimeout(() => setStatus('idle'), 6000);
    return () => clearTimeout(t);
  }, [status]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');

    const form = e.currentTarget;
    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim() || null,
      organization: form.organization.value.trim() || null,
      job_title: form.jobTitle.value.trim() || null,
      country: form.country.value.trim() || null,
      issue_type: form.issueType.value,
      rating: Number(form.rating.value),
      description: form.description.value.trim(),
    };

    // client-side validation
    const newErrors = {};
    if (!data.name) newErrors.name = 'Name is required.';
    if (!data.email) newErrors.email = 'Email is required.';
    else if (!validateEmail(data.email)) newErrors.email = 'Enter a valid email.';
    if (!data.rating || data.rating < 1 || data.rating > 5) newErrors.rating = 'Select a rating from 1 to 5.';
    if (!data.description) newErrors.description = 'Please describe your inquiry.';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setStatus('submitting');

    try {
      const resp = await fetch(`${apiBase}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        throw new Error(body.message || 'Server error');
      }

      setStatus('success');
      form.reset();

      // local backup
      const requests = JSON.parse(localStorage.getItem('cybernova_inquiries') || '[]');
      requests.push({ ...data, timestamp: new Date().toISOString() });
      localStorage.setItem('cybernova_inquiries', JSON.stringify(requests));
    } catch (err) {
      console.error('Contact submit failed', err);
      setErrorMsg(err.message || 'Submission failed');
      setStatus('saved-local');
      const requests = JSON.parse(localStorage.getItem('cybernova_inquiries') || '[]');
      requests.push({ ...data, timestamp: new Date().toISOString() });
      localStorage.setItem('cybernova_inquiries', JSON.stringify(requests));
    }
  }

  return (
    <section id="contact" className="container">
      <h2>Contact Us</h2>
      <form id="contactForm" className="contact-form glass-card" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <label className="form-field">Name
            <input id="name" name="name" aria-invalid={!!errors.name} placeholder="Full name" />
            {errors.name ? <div className="field-error">{errors.name}</div> : null}
          </label>

          <label className="form-field">Email
            <input id="email" name="email" type="email" aria-invalid={!!errors.email} placeholder="you@company.com" />
            {errors.email ? <div className="field-error">{errors.email}</div> : null}
          </label>

          <label className="form-field">Phone
            <input id="phone" name="phone" placeholder="Optional" />
          </label>
        </div>

        <div className="form-grid two-cols">
          <label className="form-field">Organization
            <input id="organization" name="organization" placeholder="Company or org" />
          </label>
          <label className="form-field">Job Title
            <input id="jobTitle" name="jobTitle" placeholder="Your role" />
          </label>
        </div>

        <div className="form-grid two-cols">
          <label className="form-field">Country
            <input id="country" name="country" placeholder="Country" />
          </label>
          <label className="form-field">Issue Type
            <select id="issueType" name="issueType">
              <option value="general">General inquiry</option>
              <option value="network">Network Security</option>
              <option value="endpoint">Endpoint Protection</option>
            </select>
          </label>
        </div>

        <label className="form-field">Rating
          <select id="rating" name="rating" aria-invalid={!!errors.rating} defaultValue="">
            <option value="" disabled>Choose a rating</option>
            <option value="1">1 - Poor</option>
            <option value="2">2 - Fair</option>
            <option value="3">3 - Good</option>
            <option value="4">4 - Very good</option>
            <option value="5">5 - Excellent</option>
          </select>
          {errors.rating ? <div className="field-error">{errors.rating}</div> : null}
        </label>

        <label className="form-field">Description
          <textarea id="description" name="description" rows="5" placeholder="How can we help?" aria-invalid={!!errors.description}></textarea>
          {errors.description ? <div className="field-error">{errors.description}</div> : null}
        </label>

        <div className="form-actions">
          <button type="submit" className={`btn btn-primary${status === 'submitting' ? ' disabled' : ''}`} disabled={status === 'submitting'}>
            {status === 'submitting' ? <span className="spinner" aria-hidden="true"></span> : null}
            {status === 'submitting' ? ' Sending...' : 'Submit'}
          </button>
        </div>

        {status === 'success' ? (
          <div className="form-success">
            <div className="checkmark-icon">✓</div>
            <span>Thanks — your inquiry has been received.</span>
          </div>
        ) : null}
        {status === 'saved-local' ? <div className="info-message">Saved locally — will submit when the server is available.</div> : null}
        {status === 'error' || errorMsg ? <div className="error-message">{errorMsg || 'Something went wrong. Please try again later.'}</div> : null}
      </form>
    </section>
  );
}
