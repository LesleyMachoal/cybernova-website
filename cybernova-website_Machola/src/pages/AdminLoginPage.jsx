import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const apiBase = import.meta.env.VITE_API_URL || '/api';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const payload = await response.json();
      if (!response.ok || !payload.access_token) {
        throw new Error(payload.message || 'Invalid credentials');
      }

      localStorage.setItem('cybernova_admin_token', payload.access_token);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-page admin-login-page flex min-h-screen items-center justify-center bg-bg-primary px-4">
      <div className="login-card glass w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-3 text-text-primary">
          <ShieldCheck className="h-8 w-8 text-accent-secondary" />
          <span className="text-lg font-semibold">CyberNova Analytics</span>
        </div>
        <h2>Admin Access</h2>
        <p className="admin-intro">Use the password to access the secure dashboard.</p>
        <form className="admin-login-form text-left" onSubmit={handleSubmit}>
          <label htmlFor="adminUsername">Username</label>
          <input
            id="adminUsername"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
          <label htmlFor="adminPassword">Password</label>
          <input
            id="adminPassword"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {error ? <p className="message-error">{error}</p> : null}
          {success ? <p className="message-success">{success}</p> : null}
          <div className="mt-6 flex flex-col gap-3">
            <Button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button>
            <Link to="/" className="text-center text-sm text-accent-secondary hover:text-text-primary">
              Back to site
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
