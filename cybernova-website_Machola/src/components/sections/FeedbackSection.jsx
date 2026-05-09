import { useEffect, useState } from 'react';
import { FeedbackCard } from '@/components/ui/FeedbackCard';
import { FeedbackSubmissionSection } from './FeedbackSubmissionSection';

const DEFAULT_FEEDBACK = [
  {
    id: '1',
    comment: 'Excellent support and fast response. CyberNova helped us surface threats we were missing and their team assisted with a smooth rollout.',
    name: 'Amina N.',
    role: 'Head of Security',
    company: 'FinCore Ltd',
    rating: 5,
  },
  {
    id: '2',
    comment: 'Improved our detection capability and reduced false positives significantly. Integration was straightforward and documentation helped a lot.',
    name: 'John M.',
    role: 'CTO',
    company: 'RetailOps',
    rating: 4,
  },
  {
    id: '3',
    comment: 'The rollout was well planned, and the team made the security improvements easy to understand for everyone involved.',
    name: 'Sarah K.',
    role: 'IT Director',
    company: 'BlueWave Health',
    rating: 5,
  },
  {
    id: '4',
    comment: 'Their incident response guidance was practical and precise. We were able to improve our process immediately.',
    name: 'Michael T.',
    role: 'Operations Manager',
    company: 'Northwind Logistics',
    rating: 5,
  },
  {
    id: '5',
    comment: 'Clear communication, strong follow-through, and a solution that matched our environment without unnecessary complexity.',
    name: 'Priya R.',
    role: 'CISO',
    company: 'ArcLight Finance',
    rating: 4,
  },
  {
    id: '6',
    comment: 'The training session was hands-on and gave our team confidence to spot phishing attempts and report them correctly.',
    name: 'Daniel O.',
    role: 'Security Lead',
    company: 'Metro Retail Group',
    rating: 5,
  },
  {
    id: '7',
    comment: 'A responsive team with solid technical depth. The project finished on time and the outcomes were easy to measure.',
    name: 'Elena M.',
    role: 'Program Director',
    company: 'Summit Energy',
    rating: 5,
  },
];

export function FeedbackSection() {
  const [showForm, setShowForm] = useState(false);
  const [feedback, setFeedback] = useState(DEFAULT_FEEDBACK);
  const [loading, setLoading] = useState(true);
  const apiBase = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch(`${apiBase}/feedback/approved`);
        if (response.ok) {
          const data = await response.json();
          // Use API data if available, otherwise use defaults
          setFeedback(data && data.length > 0 ? data : DEFAULT_FEEDBACK);
        } else {
          setFeedback(DEFAULT_FEEDBACK);
        }
      } catch (err) {
        // Fallback to default if API fails
        setFeedback(DEFAULT_FEEDBACK);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [apiBase]);

  if (loading) {
    return (
      <section className="container content-section">
        <h2>Customer Feedback</h2>
        <div style={{ textAlign: 'center', opacity: 0.6 }}>Loading feedback...</div>
      </section>
    );
  }

  return (
    <section className="container content-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Customer Feedback</h2>
        <button
          className="btn btn-secondary"
          onClick={() => setShowForm(true)}
          style={{ marginLeft: '1rem' }}
        >
          Leave Feedback
        </button>
      </div>

      {showForm ? (
        <>
          <div className={`modal-overlay ${showForm ? 'active' : ''}`} onClick={() => setShowForm(false)} />
          <div className={`modal-section ${showForm ? 'active' : ''}`}>
            <div className="modal-panel glass">
              <div className="modal-header">
                <h2>Leave Feedback</h2>
                <button className="modal-close" aria-label="Close" onClick={() => setShowForm(false)}>×</button>
              </div>
              <div className="modal-body">
                <FeedbackSubmissionSection onClose={() => setShowForm(false)} isModal={true} />
              </div>
            </div>
          </div>
        </>
      ) : null}
      <div className="feedback-grid">
        {feedback.map((f) => (
          <FeedbackCard
            key={f.id}
            feedback={{
              quote: f.comment,
              author: f.name,
              role: f.role,
              company: f.company,
              rating: f.rating,
              avatarUrl: '/assets/avatars/default-avatar.svg',
            }}
          />
        ))}
      </div>
    </section>
  );
}
