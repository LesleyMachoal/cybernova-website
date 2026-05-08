import { BarChart2, LayoutDashboard, MessageSquare, Settings, ShieldCheck, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';

const statusStyles = {
  new: { color: '#FFD166' },
  pending: { color: '#FFD166' },
  resolved: { color: '#00FF88' },
};

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function AdminDashboardPage() {
  const token = localStorage.getItem('cybernova_admin_token') || '';
  const [activeTab, setActiveTab] = useState('overview');
  const [serviceFilter, setServiceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const apiBase = import.meta.env.VITE_API_URL || '/api';

  const fetchInquiries = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${apiBase}/inquiries`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.removeItem('cybernova_admin_token');
        window.location.href = '/admin/login';
        return;
      }

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || 'Failed to load inquiries');
      }

      setRequests(payload);
    } catch (err) {
      setError(err.message || 'Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const issueType = request.issue_type || request.issueType || '';
      const status = request.status || 'new';
      const name = (request.name || '').toLowerCase();
      const email = (request.email || '').toLowerCase();
      const org = (request.organization || '').toLowerCase();
      const query = searchQuery.toLowerCase();

      const issueMatch = !serviceFilter || issueType === serviceFilter;
      const statusMatch = !statusFilter || status === statusFilter;
      const searchMatch = !query || name.includes(query) || email.includes(query) || org.includes(query);

      return issueMatch && statusMatch && searchMatch;
    });
  }, [requests, serviceFilter, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter((r) => (r.status || 'new') !== 'resolved').length,
      resolved: requests.filter((r) => r.status === 'resolved').length,
      countries: new Set(requests.map((r) => r.country).filter(Boolean)).size,
    };
  }, [requests]);

  const serviceStats = useMemo(() => {
    const stats = {};
    requests.forEach((r) => {
      const service = r.issue_type || r.issueType || 'unknown';
      stats[service] = (stats[service] || 0) + 1;
    });
    return stats;
  }, [requests]);

  const updateRequestStatus = async (requestId, nextStatus) => {
    try {
      const response = await fetch(`${apiBase}/inquiries/${requestId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || 'Failed to update status');
      }

      setRequests((prev) => prev.map((row) => (row.id === requestId ? payload : row)));
    } catch (err) {
      setError(err.message || 'Failed to update status');
    }
  };

  const deleteRequestInquiry = async (requestId) => {
    try {
      const response = await fetch(`${apiBase}/inquiries/${requestId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.message || 'Failed to delete inquiry');
      }

      setRequests((prev) => prev.filter((row) => row.id !== requestId));
      setDeleteConfirm(null);
      setSelectedInquiry(null);
    } catch (err) {
      setError(err.message || 'Failed to delete inquiry');
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Organization', 'Country', 'Job Title', 'Issue Type', 'Description', 'Date', 'Status'];
    const rows = filteredRequests.map((request) => [
      request.name || '',
      request.email || '',
      request.phone || '',
      request.organization || '',
      request.country || '',
      request.job_title || request.jobTitle || '',
      request.issue_type || request.issueType || '',
      request.description || '',
      request.submitted_at || request.timestamp || '',
      request.status || 'new',
    ]);

    let csv = `${headers.join(',')}\n`;
    rows.forEach((row) => {
      csv += `${row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cybernova_inquiries_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="admin-page min-h-screen bg-bg-primary text-text-primary">
      <div className="admin-shell">
        <aside className="admin-sidebar glass">
          <div className="mb-8 flex items-center gap-3">
            <ShieldCheck className="h-7 w-7 text-accent-secondary" />
            <div>
              <div className="logo">CyberNova Admin</div>
              <p className="text-sm text-text-secondary">Secure dashboard</p>
            </div>
          </div>
          <nav className="admin-nav">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`nav-item ${active ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
          <div className="mt-8">
            <Button variant="secondary" className="w-full" onClick={() => { localStorage.removeItem('cybernova_admin_token'); window.location.href = '/admin/login'; }}>
              Logout
            </Button>
          </div>
        </aside>

        <section className="admin-main">
          {activeTab === 'overview' ? (
            <>
              <h1>Dashboard Overview</h1>
              <div className="dashboard-stats">
                <div className="stat-box glass"><div className="stat-info"><div className="stat-label">Total Inquiries</div><div className="stat-number">{stats.total}</div></div></div>
                <div className="stat-box glass"><div className="stat-info"><div className="stat-label">Pending</div><div className="stat-number">{stats.pending}</div></div></div>
                <div className="stat-box glass"><div className="stat-info"><div className="stat-label">Resolved</div><div className="stat-number">{stats.resolved}</div></div></div>
                <div className="stat-box glass"><div className="stat-info"><div className="stat-label">Countries Served</div><div className="stat-number">{stats.countries}</div></div></div>
              </div>
              <div className="mt-12">
                <h2>Service Demand Breakdown</h2>
                <div className="dashboard-stats">
                  {Object.entries(serviceStats).map(([service, count]) => (
                    <div key={service} className="stat-box glass">
                      <div className="stat-info">
                        <div className="stat-label">{service || 'Unspecified'}</div>
                        <div className="stat-number">{count}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}

          {activeTab === 'inquiries' ? (
            <>
              <h1>Customer Inquiries</h1>
              <div className="glass admin-panel filter-controls">
                <div className="filter-group">
                  <label htmlFor="searchQuery">Search</label>
                  <input
                    id="searchQuery"
                    type="text"
                    placeholder="Name, email, or organization..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                </div>
                <div className="filter-group">
                  <label htmlFor="serviceFilter">Service Type</label>
                  <select id="serviceFilter" value={serviceFilter} onChange={(event) => setServiceFilter(event.target.value)}>
                    <option value="">All service types</option>
                    <option value="network">Network Security</option>
                    <option value="endpoint">Endpoint Protection</option>
                    <option value="identity">Identity & Access</option>
                    <option value="phishing">Phishing / Email Threat</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label htmlFor="statusFilter">Status</label>
                  <select id="statusFilter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                    <option value="">All statuses</option>
                    <option value="new">New</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Export</label>
                  <Button variant="secondary" onClick={exportToCSV}>Export CSV</Button>
                </div>
              </div>
              {loading ? <p>Loading inquiries...</p> : null}
              {error ? <p className="message-error">{error}</p> : null}
              <div className="glass requests-table-wrapper">
                <table className="requests-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Organization</th>
                      <th>Issue Type</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((request) => (
                      <tr key={request.id || request.email}>
                        <td>{request.name}</td>
                        <td>{request.email}</td>
                        <td>{request.organization}</td>
                        <td>{request.issue_type || request.issueType || '-'}</td>
                        <td>{new Date(request.submitted_at || request.timestamp || Date.now()).toLocaleDateString()}</td>
                        <td style={statusStyles[request.status] || {}}>{request.status || 'new'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <Button
                              variant="small"
                              onClick={() => setSelectedInquiry(request)}
                              style={{ fontSize: '0.85rem', padding: '6px 12px' }}
                            >
                              View
                            </Button>
                            <Button
                              variant="small"
                              onClick={() => updateRequestStatus(request.id, 'resolved')}
                              disabled={!request.id || request.status === 'resolved'}
                              style={{ fontSize: '0.85rem', padding: '6px 12px' }}
                            >
                              {request.status === 'resolved' ? 'Resolved' : 'Mark resolved'}
                            </Button>
                            <Button
                              variant="small"
                              onClick={() => setDeleteConfirm(request.id)}
                              disabled={!request.id}
                              style={{ fontSize: '0.85rem', padding: '6px 12px', background: '#FF3333', color: '#fff' }}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : null}

          {activeTab === 'analytics' ? (
            <>
              <h1>Analytics</h1>
              <div className="dashboard-charts">
                <div className="chart-placeholder glass">
                  <strong>Total Inquiries:</strong> {stats.total}
                </div>
                <div className="chart-placeholder glass">
                  <strong>Resolved Inquiries:</strong> {stats.resolved}
                </div>
                <div className="chart-placeholder glass">
                  <strong>Pending Inquiries:</strong> {stats.pending}
                </div>
                <div className="chart-placeholder glass">
                  <strong>Countries Served:</strong> {stats.countries}
                </div>
              </div>
              <div className="mt-12">
                <h2>Regional Demand</h2>
                <div className="glass admin-panel">
                  {Array.from(new Set(requests.map((r) => r.country).filter(Boolean))).map((country) => {
                    const count = requests.filter((r) => r.country === country).length;
                    return (
                      <div key={country} style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{country}</span>
                          <strong>{count} inquiries</strong>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : null}

          {activeTab === 'settings' ? (
            <>
              <h1>Settings</h1>
              <div className="glass admin-panel">
                <div className="settings-group">
                  <div className="setting-item">
                    <label htmlFor="siteName">Site Name</label>
                    <input id="siteName" type="text" defaultValue="CyberNova Analytics Ltd" />
                  </div>
                  <div className="setting-item">
                    <label htmlFor="adminEmail">Admin Email</label>
                    <input id="adminEmail" type="email" defaultValue="admin@cybernovaanalytics.co.bw" />
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </section>
      </div>

      {/* Details Modal */}
      {selectedInquiry ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}
          onClick={() => setSelectedInquiry(null)}
        >
          <div
            className="glass"
            style={{
              background: 'rgba(255,255,255,0.05)',
              padding: '32px',
              borderRadius: '12px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>Inquiry Details</h2>
              <button onClick={() => setSelectedInquiry(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '24px' }}>
                <X />
              </button>
            </div>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Name</label>
                <p style={{ marginTop: '4px' }}>{selectedInquiry.name}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email</label>
                <p style={{ marginTop: '4px' }}>{selectedInquiry.email}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Phone</label>
                <p style={{ marginTop: '4px' }}>{selectedInquiry.phone || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Organization</label>
                <p style={{ marginTop: '4px' }}>{selectedInquiry.organization || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Country</label>
                <p style={{ marginTop: '4px' }}>{selectedInquiry.country || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Job Title</label>
                <p style={{ marginTop: '4px' }}>{selectedInquiry.job_title || selectedInquiry.jobTitle || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Issue Type</label>
                <p style={{ marginTop: '4px' }}>{selectedInquiry.issue_type || selectedInquiry.issueType || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Description</label>
                <p style={{ marginTop: '4px', lineHeight: '1.6' }}>{selectedInquiry.description || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status</label>
                <p style={{ marginTop: '4px', color: statusStyles[selectedInquiry.status]?.color || '#fff' }}>
                  {selectedInquiry.status || 'new'}
                </p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Submitted</label>
                <p style={{ marginTop: '4px' }}>
                  {new Date(selectedInquiry.submitted_at || selectedInquiry.timestamp || Date.now()).toLocaleString()}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <Button onClick={() => setSelectedInquiry(null)}>Close</Button>
              <Button
                onClick={() => updateRequestStatus(selectedInquiry.id, 'resolved')}
                disabled={selectedInquiry.status === 'resolved'}
              >
                Mark Resolved
              </Button>
              <Button
                onClick={() => {
                  setDeleteConfirm(selectedInquiry.id);
                  setSelectedInquiry(null);
                }}
                style={{ background: '#FF3333' }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Delete Confirmation Modal */}
      {deleteConfirm ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="glass"
            style={{
              background: 'rgba(255,51,51,0.1)',
              padding: '32px',
              borderRadius: '12px',
              maxWidth: '400px',
              width: '90%',
              border: '1px solid rgba(255,51,51,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ color: '#FF3333', marginBottom: '16px' }}>Confirm Delete</h2>
            <p style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>
              Are you sure you want to delete this inquiry? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button
                onClick={() => deleteRequestInquiry(deleteConfirm)}
                style={{ background: '#FF3333' }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
