import { BarChart2, FileText, LayoutDashboard, MessageSquare, Settings, ShieldCheck, Menu, X, MessageCircle, Image, Star } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const statusStyles = {
  new: { color: '#FFD166' },
  pending: { color: '#FFD166' },
  resolved: { color: '#00FF88' },
  approved: { color: '#00FF88' },
  rejected: { color: '#FF4444' },
};

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
  { id: 'feedback', label: 'Feedback', icon: Star },
  { id: 'articles', label: 'Articles', icon: FileText },
  { id: 'services', label: 'Services', icon: ShieldCheck },
  { id: 'case-studies', label: 'Case Studies', icon: BarChart2 },
  { id: 'events', label: 'Events', icon: BarChart2 },
  { id: 'gallery', label: 'Gallery', icon: Image },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const readJsonResponse = async (response) => {
  const text = await response.text();

  if (!text) {
    return {};
  }

  return JSON.parse(text);
};

export function AdminDashboardPage() {
  const token = localStorage.getItem('cybernova_admin_token') || '';
  const apiBase = import.meta.env.VITE_API_URL || '/api';

  // ====== INQUIRIES STATE ======
  const [activeTab, setActiveTab] = useState('overview');
  const [isAdminNavOpen, setIsAdminNavOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // ====== ARTICLES STATE ======
  const [articles, setArticles] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [articlesError, setArticlesError] = useState('');
  const [articleSearchQuery, setArticleSearchQuery] = useState('');
  const [articleStatusFilter, setArticleStatusFilter] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articleDeleteConfirm, setArticleDeleteConfirm] = useState(null);
  const [articleFormOpen, setArticleFormOpen] = useState(false);
  const [articleFormMode, setArticleFormMode] = useState('create');
  const [articleSaving, setArticleSaving] = useState(false);
  const [articleForm, setArticleForm] = useState({
    id: '',
    title: '',
    excerpt: '',
    author: '',
    date: '',
    link: '#',
    tags: '',
    thumbnail: '',
    status: 'published',
  });

  // ====== SERVICES STATE ======
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState('');
  const [serviceSearchQuery, setServiceSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [serviceDeleteConfirm, setServiceDeleteConfirm] = useState(null);
  const [serviceFormOpen, setServiceFormOpen] = useState(false);
  const [serviceFormMode, setServiceFormMode] = useState('create');
  const [serviceSaving, setServiceSaving] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    id: '',
    name: '',
    description: '',
    icon: '',
    price: '',
  });

  // ====== CASE STUDIES STATE ======
  const [caseStudies, setCaseStudies] = useState([]);
  const [caseStudiesLoading, setCaseStudiesLoading] = useState(true);
  const [caseStudiesError, setCaseStudiesError] = useState('');
  const [caseStudySearchQuery, setCaseStudySearchQuery] = useState('');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);
  const [caseStudyDeleteConfirm, setCaseStudyDeleteConfirm] = useState(null);
  const [caseStudyFormOpen, setCaseStudyFormOpen] = useState(false);
  const [caseStudyFormMode, setCaseStudyFormMode] = useState('create');
  const [caseStudySaving, setCaseStudySaving] = useState(false);
  const [caseStudyForm, setCaseStudyForm] = useState({
    id: '',
    title: '',
    client: '',
    industry: '',
    challenge: '',
    solution: '',
    result: '',
    metrics: '',
  });

  // ====== EVENTS STATE ======
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState('');
  const [eventSearchQuery, setEventSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventDeleteConfirm, setEventDeleteConfirm] = useState(null);
  const [eventFormOpen, setEventFormOpen] = useState(false);
  const [eventFormMode, setEventFormMode] = useState('create');
  const [eventSaving, setEventSaving] = useState(false);
  const [eventForm, setEventForm] = useState({
    id: '',
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    link: '',
    status: 'upcoming',
  });

  // ====== FEEDBACK STATE ======
  const [feedback, setFeedback] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [feedbackError, setFeedbackError] = useState('');
  const [feedbackSearchQuery, setFeedbackSearchQuery] = useState('');
  const [feedbackStatusFilter, setFeedbackStatusFilter] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [feedbackDeleteConfirm, setFeedbackDeleteConfirm] = useState(null);
  const [feedbackFormOpen, setFeedbackFormOpen] = useState(false);
  const [feedbackFormMode, setFeedbackFormMode] = useState('view');
  const [feedbackSaving, setFeedbackSaving] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    id: '',
    name: '',
    email: '',
    rating: 5,
    comment: '',
    company: '',
    role: '',
    status: 'pending',
  });

  // ====== GALLERY STATE ======
  const [gallery, setGallery] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryError, setGalleryError] = useState('');
  const [gallerySearchQuery, setGallerySearchQuery] = useState('');
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(null);
  const [galleryDeleteConfirm, setGalleryDeleteConfirm] = useState(null);
  const [galleryFormOpen, setGalleryFormOpen] = useState(false);
  const [galleryFormMode, setGalleryFormMode] = useState('create');
  const [gallerySaving, setGallerySaving] = useState(false);
  const [galleryForm, setGalleryForm] = useState({
    id: '',
    image_url: '',
    title: '',
    description: '',
    category: 'workshop',
  });
  const [galleryUploadFile, setGalleryUploadFile] = useState(null);

  useEffect(() => {
    const syncAdminNavState = () => {
      if (window.innerWidth > 980) {
        setIsAdminNavOpen(true);
      } else {
        setIsAdminNavOpen(false);
      }
    };

    syncAdminNavState();
    window.addEventListener('resize', syncAdminNavState);

    return () => window.removeEventListener('resize', syncAdminNavState);
  }, []);

  // ====== FETCH FUNCTIONS ======
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

      const payload = await readJsonResponse(response);
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

  const fetchArticles = async () => {
    setArticlesLoading(true);
    setArticlesError('');
    try {
      const response = await fetch(`${apiBase}/articles`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.removeItem('cybernova_admin_token');
        window.location.href = '/admin/login';
        return;
      }

      const payload = await readJsonResponse(response);
      if (!response.ok) {
        throw new Error(payload.message || 'Failed to load articles');
      }

      setArticles(payload);
    } catch (err) {
      setArticlesError(err.message || 'Failed to load articles');
    } finally {
      setArticlesLoading(false);
    }
  };

  const fetchServices = async () => {
    setServicesLoading(true);
    setServicesError('');
    try {
      const response = await fetch(`${apiBase}/services`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.removeItem('cybernova_admin_token');
        window.location.href = '/admin/login';
        return;
      }

      const payload = await readJsonResponse(response);
      if (!response.ok) {
        throw new Error(payload.message || 'Failed to load services');
      }

      setServices(payload);
    } catch (err) {
      setServicesError(err.message || 'Failed to load services');
    } finally {
      setServicesLoading(false);
    }
  };

  const fetchCaseStudies = async () => {
    setCaseStudiesLoading(true);
    setCaseStudiesError('');
    try {
      const response = await fetch(`${apiBase}/case-studies`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.removeItem('cybernova_admin_token');
        window.location.href = '/admin/login';
        return;
      }

      const payload = await readJsonResponse(response);
      if (!response.ok) {
        throw new Error(payload.message || 'Failed to load case studies');
      }

      setCaseStudies(payload);
    } catch (err) {
      setCaseStudiesError(err.message || 'Failed to load case studies');
    } finally {
      setCaseStudiesLoading(false);
    }
  };

  const fetchEvents = async () => {
    setEventsLoading(true);
    setEventsError('');
    try {
      const response = await fetch(`${apiBase}/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.removeItem('cybernova_admin_token');
        window.location.href = '/admin/login';
        return;
      }

      const payload = await readJsonResponse(response);
      if (!response.ok) {
        throw new Error(payload.message || 'Failed to load events');
      }

      setEvents(payload);
    } catch (err) {
      setEventsError(err.message || 'Failed to load events');
    } finally {
      setEventsLoading(false);
    }
  };

  const fetchFeedback = async () => {
    setFeedbackLoading(true);
    setFeedbackError('');
    try {
      const response = await fetch(`${apiBase}/feedback`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.removeItem('cybernova_admin_token');
        window.location.href = '/admin/login';
        return;
      }

      const payload = await readJsonResponse(response);
      if (!response.ok) {
        throw new Error(payload.message || 'Failed to load feedback');
      }

      setFeedback(payload);
    } catch (err) {
      setFeedbackError(err.message || 'Failed to load feedback');
    } finally {
      setFeedbackLoading(false);
    }
  };

  const fetchGallery = async () => {
    setGalleryLoading(true);
    setGalleryError('');
    try {
      const response = await fetch(`${apiBase}/gallery`);

      const payload = await readJsonResponse(response);
      if (!response.ok) {
        throw new Error(payload.message || 'Failed to load gallery');
      }

      setGallery(payload);
    } catch (err) {
      setGalleryError(err.message || 'Failed to load gallery');
    } finally {
      setGalleryLoading(false);
    }
  };

  // ====== INITIAL DATA LOAD ======
  useEffect(() => {
    fetchInquiries();
    fetchArticles();
    fetchServices();
    fetchCaseStudies();
    fetchEvents();
    fetchFeedback();
    fetchGallery();
  }, []);

  // ====== DERIVED DATA (useMemo) ======
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

  const filteredArticles = useMemo(() => {
    const query = articleSearchQuery.toLowerCase();
    return articles.filter((article) => {
      const title = (article.title || '').toLowerCase();
      const author = (article.author || '').toLowerCase();
      const tags = Array.isArray(article.tags) ? article.tags.join(' ').toLowerCase() : String(article.tags || '').toLowerCase();
      const status = (article.status || 'published').toLowerCase();
      const matchesQuery = !query || title.includes(query) || author.includes(query) || tags.includes(query);
      return matchesQuery && (!articleStatusFilter || status === articleStatusFilter);
    });
  }, [articles, articleSearchQuery, articleStatusFilter]);

  const filteredServices = useMemo(() => {
    const query = serviceSearchQuery.toLowerCase();
    return services.filter((service) => {
      const name = (service.name || '').toLowerCase();
      const description = (service.description || '').toLowerCase();
      return !query || name.includes(query) || description.includes(query);
    });
  }, [services, serviceSearchQuery]);

  const filteredCaseStudies = useMemo(() => {
    const query = caseStudySearchQuery.toLowerCase();
    return caseStudies.filter((study) => {
      const title = (study.title || '').toLowerCase();
      const client = (study.client || '').toLowerCase();
      const industry = (study.industry || '').toLowerCase();
      return !query || title.includes(query) || client.includes(query) || industry.includes(query);
    });
  }, [caseStudies, caseStudySearchQuery]);

  const filteredEvents = useMemo(() => {
    const query = eventSearchQuery.toLowerCase();
    return events.filter((event) => {
      const title = (event.title || '').toLowerCase();
      const location = (event.location || '').toLowerCase();
      return !query || title.includes(query) || location.includes(query);
    });
  }, [events, eventSearchQuery]);

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

  const serviceChartData = useMemo(() => {
    const labels = Object.keys(serviceStats);
    const data = Object.values(serviceStats);
    return {
      labels,
      datasets: [
        {
          label: 'Inquiries',
          data,
          backgroundColor: labels.map((_, i) => `hsl(${(i * 55) % 360} 85% 55%)`),
        },
      ],
    };
  }, [serviceStats]);

  const countryChartData = useMemo(() => {
    const byCountry = requests.reduce((acc, r) => {
      const c = (r.country || 'Unknown').trim();
      acc[c] = (acc[c] || 0) + 1;
      return acc;
    }, {});
    const entries = Object.entries(byCountry).sort((a, b) => b[1] - a[1]);
    const labels = entries.map((e) => e[0]);
    const data = entries.map((e) => e[1]);
    return {
      labels,
      datasets: [
        {
          label: 'Requests by country',
          data,
          backgroundColor: labels.map((_, i) => `hsl(${(i * 40) % 360} 85% 60%)`),
        },
      ],
    };
  }, [requests]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
  }), []);

  // ====== INQUIRIES CRUD ======
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

      const payload = await readJsonResponse(response);
      if (!response.ok) {
        throw new Error(payload.message || 'Failed to update status');
      }

      setRequests((prev) => prev.map((row) => (row.id === requestId ? payload : row)));

      if (nextStatus === 'resolved') {
        await fetchFeedback();
      }
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
        const payload = await readJsonResponse(response);
        throw new Error(payload.message || 'Failed to delete inquiry');
      }

      setRequests((prev) => prev.filter((row) => row.id !== requestId));
      setDeleteConfirm(null);
      setSelectedInquiry(null);
    } catch (err) {
      setError(err.message || 'Failed to delete inquiry');
    }
  };

  // ====== ARTICLES CRUD ======
  const openCreateArticle = () => {
    setSelectedArticle(null);
    setArticleDeleteConfirm(null);
    setArticleFormMode('create');
    setArticleForm({
      id: '',
      title: '',
      excerpt: '',
      author: '',
      date: '',
      link: '#',
      tags: '',
      thumbnail: '',
      status: 'published',
    });
    setArticleFormOpen(true);
  };

  const openEditArticle = (article) => {
    setSelectedArticle(null);
    setArticleDeleteConfirm(null);
    setArticleFormMode('edit');
    setArticleForm({
      id: article.id || '',
      title: article.title || '',
      excerpt: article.excerpt || '',
      author: article.author || '',
      date: article.date || '',
      link: article.link || '#',
      tags: Array.isArray(article.tags) ? article.tags.join(', ') : (article.tags || ''),
      thumbnail: article.thumbnail || '',
      status: article.status || 'published',
    });
    setArticleFormOpen(true);
  };

  const saveArticle = async (event) => {
    event.preventDefault();
    setArticleSaving(true);
    setArticlesError('');

    const payload = {
      title: articleForm.title,
      excerpt: articleForm.excerpt,
      author: articleForm.author,
      date: articleForm.date,
      link: articleForm.link,
      tags: articleForm.tags,
      thumbnail: articleForm.thumbnail,
      status: articleForm.status,
    };

    try {
      const response = await fetch(
        articleFormMode === 'edit' && articleForm.id ? `${apiBase}/articles/${articleForm.id}` : `${apiBase}/articles`,
        {
          method: articleFormMode === 'edit' && articleForm.id ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const responsePayload = await response.json();
      if (!response.ok) {
        throw new Error(responsePayload.message || 'Failed to save article');
      }

      setArticles((prev) => {
        const exists = prev.some((row) => String(row.id) === String(responsePayload.id));
        if (exists) {
          return prev.map((row) => (String(row.id) === String(responsePayload.id) ? responsePayload : row));
        }
        return [responsePayload, ...prev];
      });
      setArticleFormOpen(false);
      setSelectedArticle(responsePayload);
    } catch (err) {
      setArticlesError(err.message || 'Failed to save article');
    } finally {
      setArticleSaving(false);
    }
  };

  const deleteArticle = async (articleId) => {
    try {
      const response = await fetch(`${apiBase}/articles/${articleId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const payload = await readJsonResponse(response);
        throw new Error(payload.message || 'Failed to delete article');
      }

      setArticles((prev) => prev.filter((row) => String(row.id) !== String(articleId)));
      setArticleDeleteConfirm(null);
      setSelectedArticle(null);
    } catch (err) {
      setArticlesError(err.message || 'Failed to delete article');
    }
  };

  // ====== SERVICES CRUD ======
  const openCreateService = () => {
    setSelectedService(null);
    setServiceDeleteConfirm(null);
    setServiceFormMode('create');
    setServiceForm({
      id: '',
      name: '',
      description: '',
      icon: '',
      price: '',
    });
    setServiceFormOpen(true);
  };

  const openEditService = (service) => {
    setSelectedService(null);
    setServiceDeleteConfirm(null);
    setServiceFormMode('edit');
    setServiceForm({
      id: service.id || '',
      name: service.name || '',
      description: service.description || '',
      icon: service.icon || '',
      price: service.price || '',
    });
    setServiceFormOpen(true);
  };

  const saveService = async (event) => {
    event.preventDefault();
    setServiceSaving(true);
    setServicesError('');

    const payload = {
      name: serviceForm.name,
      description: serviceForm.description,
      icon: serviceForm.icon,
      price: serviceForm.price,
    };

    try {
      const response = await fetch(
        serviceFormMode === 'edit' && serviceForm.id ? `${apiBase}/services/${serviceForm.id}` : `${apiBase}/services`,
        {
          method: serviceFormMode === 'edit' && serviceForm.id ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const responsePayload = await response.json();
      if (!response.ok) {
        throw new Error(responsePayload.message || 'Failed to save service');
      }

      setServices((prev) => {
        const exists = prev.some((row) => String(row.id) === String(responsePayload.id));
        if (exists) {
          return prev.map((row) => (String(row.id) === String(responsePayload.id) ? responsePayload : row));
        }
        return [responsePayload, ...prev];
      });
      setServiceFormOpen(false);
      setSelectedService(responsePayload);
    } catch (err) {
      setServicesError(err.message || 'Failed to save service');
    } finally {
      setServiceSaving(false);
    }
  };

  const deleteService = async (serviceId) => {
    try {
      const response = await fetch(`${apiBase}/services/${serviceId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const payload = await readJsonResponse(response);
        throw new Error(payload.message || 'Failed to delete service');
      }

      setServices((prev) => prev.filter((row) => String(row.id) !== String(serviceId)));
      setServiceDeleteConfirm(null);
      setSelectedService(null);
    } catch (err) {
      setServicesError(err.message || 'Failed to delete service');
    }
  };

  // ====== CASE STUDIES CRUD ======
  const openCreateCaseStudy = () => {
    setSelectedCaseStudy(null);
    setCaseStudyDeleteConfirm(null);
    setCaseStudyFormMode('create');
    setCaseStudyForm({
      id: '',
      title: '',
      client: '',
      industry: '',
      challenge: '',
      solution: '',
      result: '',
      metrics: '',
    });
    setCaseStudyFormOpen(true);
  };

  const openEditCaseStudy = (caseStudy) => {
    setSelectedCaseStudy(null);
    setCaseStudyDeleteConfirm(null);
    setCaseStudyFormMode('edit');
    setCaseStudyForm({
      id: caseStudy.id || '',
      title: caseStudy.title || '',
      client: caseStudy.client || '',
      industry: caseStudy.industry || '',
      challenge: caseStudy.challenge || '',
      solution: caseStudy.solution || '',
      result: caseStudy.result || '',
      metrics: caseStudy.metrics || '',
    });
    setCaseStudyFormOpen(true);
  };

  const saveCaseStudy = async (event) => {
    event.preventDefault();
    setCaseStudySaving(true);
    setCaseStudiesError('');

    const payload = {
      title: caseStudyForm.title,
      client: caseStudyForm.client,
      industry: caseStudyForm.industry,
      challenge: caseStudyForm.challenge,
      solution: caseStudyForm.solution,
      result: caseStudyForm.result,
      metrics: caseStudyForm.metrics,
    };

    try {
      const response = await fetch(
        caseStudyFormMode === 'edit' && caseStudyForm.id ? `${apiBase}/case-studies/${caseStudyForm.id}` : `${apiBase}/case-studies`,
        {
          method: caseStudyFormMode === 'edit' && caseStudyForm.id ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const responsePayload = await response.json();
      if (!response.ok) {
        throw new Error(responsePayload.message || 'Failed to save case study');
      }

      setCaseStudies((prev) => {
        const exists = prev.some((row) => String(row.id) === String(responsePayload.id));
        if (exists) {
          return prev.map((row) => (String(row.id) === String(responsePayload.id) ? responsePayload : row));
        }
        return [responsePayload, ...prev];
      });
      setCaseStudyFormOpen(false);
      setSelectedCaseStudy(responsePayload);
    } catch (err) {
      setCaseStudiesError(err.message || 'Failed to save case study');
    } finally {
      setCaseStudySaving(false);
    }
  };

  const deleteCaseStudy = async (caseStudyId) => {
    try {
      const response = await fetch(`${apiBase}/case-studies/${caseStudyId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const payload = await readJsonResponse(response);
        throw new Error(payload.message || 'Failed to delete case study');
      }

      setCaseStudies((prev) => prev.filter((row) => String(row.id) !== String(caseStudyId)));
      setCaseStudyDeleteConfirm(null);
      setSelectedCaseStudy(null);
    } catch (err) {
      setCaseStudiesError(err.message || 'Failed to delete case study');
    }
  };

  // ====== EVENTS CRUD ======
  const openCreateEvent = () => {
    setSelectedEvent(null);
    setEventDeleteConfirm(null);
    setEventFormMode('create');
    setEventForm({
      id: '',
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      link: '',
      status: 'upcoming',
    });
    setEventFormOpen(true);
  };

  const openEditEvent = (event) => {
    setSelectedEvent(null);
    setEventDeleteConfirm(null);
    setEventFormMode('edit');
    setEventForm({
      id: event.id || '',
      title: event.title || '',
      date: event.date || '',
      time: event.time || '',
      location: event.location || '',
      description: event.description || '',
      link: event.link || '',
      status: event.status || 'upcoming',
    });
    setEventFormOpen(true);
  };

  const saveEvent = async (eventData) => {
    eventData.preventDefault();
    setEventSaving(true);
    setEventsError('');

    const payload = {
      title: eventForm.title,
      date: eventForm.date,
      time: eventForm.time,
      location: eventForm.location,
      description: eventForm.description,
      link: eventForm.link,
      status: eventForm.status,
    };

    try {
      const response = await fetch(
        eventFormMode === 'edit' && eventForm.id ? `${apiBase}/events/${eventForm.id}` : `${apiBase}/events`,
        {
          method: eventFormMode === 'edit' && eventForm.id ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const responsePayload = await response.json();
      if (!response.ok) {
        throw new Error(responsePayload.message || 'Failed to save event');
      }

      setEvents((prev) => {
        const exists = prev.some((row) => String(row.id) === String(responsePayload.id));
        if (exists) {
          return prev.map((row) => (String(row.id) === String(responsePayload.id) ? responsePayload : row));
        }
        return [responsePayload, ...prev];
      });
      setEventFormOpen(false);
      setSelectedEvent(responsePayload);
    } catch (err) {
      setEventsError(err.message || 'Failed to save event');
    } finally {
      setEventSaving(false);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      const response = await fetch(`${apiBase}/events/${eventId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const payload = await readJsonResponse(response);
        throw new Error(payload.message || 'Failed to delete event');
      }

      setEvents((prev) => prev.filter((row) => String(row.id) !== String(eventId)));
      setEventDeleteConfirm(null);
      setSelectedEvent(null);
    } catch (err) {
      setEventsError(err.message || 'Failed to delete event');
    }
  };

  // ====== FEEDBACK CRUD ======
  const deleteFeedback = async (feedbackId) => {
    try {
      const response = await fetch(`${apiBase}/feedback/${feedbackId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const payload = await readJsonResponse(response);
        throw new Error(payload.message || 'Failed to delete feedback');
      }

      setFeedback((prev) => prev.filter((row) => String(row.id) !== String(feedbackId)));
      setFeedbackDeleteConfirm(null);
      setSelectedFeedback(null);
    } catch (err) {
      setFeedbackError(err.message || 'Failed to delete feedback');
    }
  };

  // ====== GALLERY CRUD ======
  const deleteGalleryItem = async (itemId) => {
    try {
      const response = await fetch(`${apiBase}/gallery/${itemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const payload = await readJsonResponse(response);
        throw new Error(payload.message || 'Failed to delete gallery item');
      }

      setGallery((prev) => prev.filter((row) => String(row.id) !== String(itemId)));
      setGalleryDeleteConfirm(null);
      setSelectedGalleryItem(null);
    } catch (err) {
      setGalleryError(err.message || 'Failed to delete gallery item');
    }
  };

  const createGalleryItem = async () => {
    try {
      setGallerySaving(true);
      const response = await fetch(`${apiBase}/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          image_url: galleryForm.image_url,
          title: galleryForm.title,
          description: galleryForm.description,
          category: galleryForm.category,
        }),
      });

      const payload = await readJsonResponse(response);
      if (!response.ok) {
        throw new Error(payload.message || 'Failed to create gallery item');
      }

      setGallery((prev) => [payload, ...prev]);
      setGalleryFormOpen(false);
      setGalleryForm({ id: '', image_url: '', title: '', description: '', category: 'workshop' });
      setGalleryUploadFile(null);
    } catch (err) {
      setGalleryError(err.message || 'Failed to create gallery item');
    } finally {
      setGallerySaving(false);
    }
  };

  const uploadGalleryImage = async (file) => {
    try {
      setGallerySaving(true);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', galleryForm.title);
      formData.append('description', galleryForm.description);
      formData.append('category', galleryForm.category);

      const response = await fetch(`${apiBase}/gallery/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const payload = await readJsonResponse(response);
      if (!response.ok) throw new Error(payload.message || 'Failed to upload image');

      setGallery((prev) => [payload, ...prev]);
      setGalleryFormOpen(false);
      setGalleryForm({ id: '', image_url: '', title: '', description: '', category: 'workshop' });
      setGalleryUploadFile(null);
    } catch (err) {
      setGalleryError(err.message || 'Failed to upload image');
    } finally {
      setGallerySaving(false);
    }
  };

  // ====== EXPORT ======
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

  const handleAdminTabSelect = (tabId) => {
    setActiveTab(tabId);

    if (window.innerWidth <= 980) {
      setIsAdminNavOpen(false);
    }
  };

  // ====== RENDER ======
  return (
    <main className="admin-page min-h-screen bg-bg-primary text-text-primary">
      <div className="admin-shell">
        <aside className={`admin-sidebar glass ${isAdminNavOpen ? 'nav-open' : 'nav-closed'}`}>
          <div className="admin-sidebar-header">
            <div className="mb-0 flex items-center gap-3">
              <ShieldCheck className="h-7 w-7 text-accent-secondary" />
              <div>
                <div className="logo">CyberNova Admin</div>
              </div>
            </div>
            <button
              type="button"
              className="admin-nav-toggle"
              aria-expanded={isAdminNavOpen}
              aria-label={isAdminNavOpen ? 'Close admin navigation' : 'Open admin navigation'}
              onClick={() => setIsAdminNavOpen((current) => !current)}
            >
              {isAdminNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
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
                  onClick={() => handleAdminTabSelect(tab.id)}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="admin-main">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
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
          )}

          {/* INQUIRIES TAB */}
          {activeTab === 'inquiries' && (
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
                    style={{ color: '#000000', caretColor: '#000000' }}
                  />
                </div>
                <div className="filter-group">
                  <label htmlFor="serviceFilter">Service Type</label>
                  <select
                    id="serviceFilter"
                    value={serviceFilter}
                    onChange={(event) => setServiceFilter(event.target.value)}
                    style={{ color: '#000000', backgroundColor: '#ffffff', caretColor: '#000000' }}
                  >
                    <option value="" style={{ color: '#000000' }}>All service types</option>
                    <option value="network" style={{ color: '#000000' }}>Network Security</option>
                    <option value="endpoint" style={{ color: '#000000' }}>Endpoint Protection</option>
                    <option value="identity" style={{ color: '#000000' }}>Identity & Access</option>
                    <option value="phishing" style={{ color: '#000000' }}>Phishing / Email Threat</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label htmlFor="statusFilter">Status</label>
                  <select
                    id="statusFilter"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    style={{ color: '#000000', backgroundColor: '#ffffff', caretColor: '#000000' }}
                  >
                    <option value="" style={{ color: '#000000' }}>All statuses</option>
                    <option value="new" style={{ color: '#000000' }}>New</option>
                    <option value="pending" style={{ color: '#000000' }}>Pending</option>
                    <option value="resolved" style={{ color: '#000000' }}>Resolved</option>
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
          )}

          {/* ARTICLES TAB */}
          {activeTab === 'articles' && (
            <>
              <h1>Articles Management</h1>
              <div className="glass admin-panel filter-controls">
                <div className="filter-group">
                  <label htmlFor="articleSearchQuery">Search</label>
                  <input
                    id="articleSearchQuery"
                    type="text"
                    placeholder="Title, author, or tags..."
                    value={articleSearchQuery}
                    onChange={(event) => setArticleSearchQuery(event.target.value)}
                    style={{ color: '#000000', caretColor: '#000000' }}
                  />
                </div>
                <div className="filter-group">
                  <label htmlFor="articleStatusFilter">Status</label>
                  <select
                    id="articleStatusFilter"
                    value={articleStatusFilter}
                    onChange={(event) => setArticleStatusFilter(event.target.value)}
                    style={{ color: '#000000', backgroundColor: '#ffffff', caretColor: '#000000' }}
                  >
                    <option value="" style={{ color: '#000000' }}>All statuses</option>
                    <option value="published" style={{ color: '#000000' }}>Published</option>
                    <option value="draft" style={{ color: '#000000' }}>Draft</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Action</label>
                  <Button variant="secondary" onClick={openCreateArticle}>+ New Article</Button>
                </div>
              </div>
              {articlesLoading ? <p>Loading articles...</p> : null}
              {articlesError ? <p className="message-error">{articlesError}</p> : null}
              <div className="glass requests-table-wrapper">
                <table className="requests-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredArticles.map((article) => (
                      <tr key={article.id}>
                        <td>{article.title}</td>
                        <td>{article.author || '-'}</td>
                        <td>{article.date || '-'}</td>
                        <td style={{ color: article.status === 'draft' ? '#FFD166' : '#00FF88' }}>{article.status || 'published'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <Button
                              variant="small"
                              onClick={() => setSelectedArticle(article)}
                              style={{ fontSize: '0.85rem', padding: '6px 12px' }}
                            >
                              View
                            </Button>
                            <Button
                              variant="small"
                              onClick={() => openEditArticle(article)}
                              style={{ fontSize: '0.85rem', padding: '6px 12px' }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="small"
                              onClick={() => setArticleDeleteConfirm(article.id)}
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
          )}

          {/* SERVICES TAB */}
          {activeTab === 'services' && (
            <>
              <h1>Services Management</h1>
              <div className="glass admin-panel filter-controls">
                <div className="filter-group">
                  <label htmlFor="serviceSearchQuery">Search</label>
                  <input
                    id="serviceSearchQuery"
                    type="text"
                    placeholder="Service name or description..."
                    value={serviceSearchQuery}
                    onChange={(event) => setServiceSearchQuery(event.target.value)}
                    style={{ color: '#000000', caretColor: '#000000' }}
                  />
                </div>
                <div className="filter-group">
                  <label>Action</label>
                  <Button variant="secondary" onClick={openCreateService}>+ New Service</Button>
                </div>
              </div>
              {servicesLoading ? <p>Loading services...</p> : null}
              {servicesError ? <p className="message-error">{servicesError}</p> : null}
              <div className="glass requests-table-wrapper">
                <table className="requests-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredServices.map((service) => (
                      <tr key={service.id}>
                        <td>{service.name}</td>
                        <td>{service.description}</td>
                        <td>{service.price}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <Button
                              variant="small"
                              onClick={() => setSelectedService(service)}
                              style={{ fontSize: '0.85rem', padding: '6px 12px' }}
                            >
                              View
                            </Button>
                            <Button
                              variant="small"
                              onClick={() => openEditService(service)}
                              style={{ fontSize: '0.85rem', padding: '6px 12px' }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="small"
                              onClick={() => setServiceDeleteConfirm(service.id)}
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
          )}

          {/* CASE STUDIES TAB */}
          {activeTab === 'case-studies' && (
            <>
              <h1>Case Studies Management</h1>
              <div className="glass admin-panel filter-controls">
                <div className="filter-group">
                  <label htmlFor="caseStudySearchQuery">Search</label>
                  <input
                    id="caseStudySearchQuery"
                    type="text"
                    placeholder="Title, client, or industry..."
                    value={caseStudySearchQuery}
                    onChange={(event) => setCaseStudySearchQuery(event.target.value)}
                    style={{ color: '#000000', caretColor: '#000000' }}
                  />
                </div>
                <div className="filter-group">
                  <label>Action</label>
                  <Button variant="secondary" onClick={openCreateCaseStudy}>+ New Case Study</Button>
                </div>
              </div>
              {caseStudiesLoading ? <p>Loading case studies...</p> : null}
              {caseStudiesError ? <p className="message-error">{caseStudiesError}</p> : null}
              <div className="glass requests-table-wrapper">
                <table className="requests-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Client</th>
                      <th>Industry</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCaseStudies.map((study) => (
                      <tr key={study.id}>
                        <td>{study.title}</td>
                        <td>{study.client}</td>
                        <td>{study.industry}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <Button
                              variant="small"
                              onClick={() => setSelectedCaseStudy(study)}
                              style={{ fontSize: '0.85rem', padding: '6px 12px' }}
                            >
                              View
                            </Button>
                            <Button
                              variant="small"
                              onClick={() => openEditCaseStudy(study)}
                              style={{ fontSize: '0.85rem', padding: '6px 12px' }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="small"
                              onClick={() => setCaseStudyDeleteConfirm(study.id)}
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
          )}

          {/* EVENTS TAB */}
          {activeTab === 'events' && (
            <>
              <h1>Events Management</h1>
              <div className="glass admin-panel filter-controls">
                <div className="filter-group">
                  <label htmlFor="eventSearchQuery">Search</label>
                  <input
                    id="eventSearchQuery"
                    type="text"
                    placeholder="Event name or location..."
                    value={eventSearchQuery}
                    onChange={(event) => setEventSearchQuery(event.target.value)}
                    style={{ color: '#000000', caretColor: '#000000' }}
                  />
                </div>
                <div className="filter-group">
                  <label>Action</label>
                  <Button variant="secondary" onClick={openCreateEvent}>+ New Event</Button>
                </div>
              </div>
              {eventsLoading ? <p>Loading events...</p> : null}
              {eventsError ? <p className="message-error">{eventsError}</p> : null}
              <div className="glass requests-table-wrapper">
                <table className="requests-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.map((event) => (
                      <tr key={event.id}>
                        <td>{event.title}</td>
                        <td>{event.date}</td>
                        <td>{event.time}</td>
                        <td>{event.location}</td>
                        <td style={{ color: event.status === 'past' ? '#FFD166' : '#00FF88' }}>{event.status}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <Button
                              variant="small"
                              onClick={() => setSelectedEvent(event)}
                              style={{ fontSize: '0.85rem', padding: '6px 12px' }}
                            >
                              View
                            </Button>
                            <Button
                              variant="small"
                              onClick={() => openEditEvent(event)}
                              style={{ fontSize: '0.85rem', padding: '6px 12px' }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="small"
                              onClick={() => setEventDeleteConfirm(event.id)}
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
          )}

          {/* FEEDBACK TAB */}
          {activeTab === 'feedback' && (
            <>
              <h1>Customer Feedback</h1>
              {feedbackError && (
                <div style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', padding: '12px', borderRadius: '8px', color: '#ff4444', marginBottom: '16px' }}>
                  {feedbackError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={feedbackSearchQuery}
                  onChange={(e) => setFeedbackSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    background: 'rgba(0, 212, 255, 0.05)',
                    border: '1px solid rgba(0, 212, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'inherit',
                  }}
                />
                <select
                  value={feedbackStatusFilter}
                  onChange={(e) => setFeedbackStatusFilter(e.target.value)}
                  style={{
                    padding: '10px 12px',
                    background: 'rgba(0, 212, 255, 0.05)',
                    border: '1px solid rgba(0, 212, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'inherit',
                  }}
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {feedbackLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', opacity: 0.6 }}>Loading feedback...</div>
              ) : (
                <div className="glass" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(0,212,255,0.2)' }}>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Author</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Email</th>
                        <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>Rating</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Status</th>
                        <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feedback.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
                          <td style={{ padding: '12px' }}>{item.name}</td>
                          <td style={{ padding: '12px', fontSize: '0.85rem' }}>{item.email}</td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>{'★'.repeat(item.rating)}</td>
                          <td style={{ padding: '12px', color: statusStyles[item.status]?.color }}>{item.status}</td>
                          <td style={{ padding: '12px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <Button variant="small" onClick={() => setSelectedFeedback(item)} style={{ fontSize: '0.85rem', padding: '6px 12px' }}>View</Button>
                            <Button
                              variant="small"
                              onClick={() => {
                                const nextStatus = item.status === 'approved' ? 'rejected' : 'approved';
                                (async () => {
                                  try {
                                    const response = await fetch(`${apiBase}/feedback/${item.id}/status`, {
                                      method: 'PATCH',
                                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                                      body: JSON.stringify({ status: nextStatus }),
                                    });
                                    if (response.ok) {
                                      setFeedback(prev => prev.map(f => f.id === item.id ? { ...f, status: nextStatus } : f));
                                    }
                                  } catch (err) {
                                    setFeedbackError(err.message);
                                  }
                                })();
                              }}
                              style={{ fontSize: '0.85rem', padding: '6px 12px', background: item.status === 'approved' ? '#FF9500' : '#00FF88' }}
                            >
                              {item.status === 'approved' ? 'Reject' : 'Approve'}
                            </Button>
                            <Button variant="small" onClick={() => setFeedbackDeleteConfirm(item.id)} style={{ fontSize: '0.85rem', padding: '6px 12px', background: '#FF3333' }}>Delete</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {feedback.length === 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', opacity: 0.6 }}>No feedback submissions yet</div>
                  )}
                </div>
              )}
            </>
          )}

          {/* GALLERY TAB */}
          {activeTab === 'gallery' && (
            <>
              <h1>Gallery Management</h1>
              {galleryError && (
                <div style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', padding: '12px', borderRadius: '8px', color: '#ff4444', marginBottom: '16px' }}>
                  {galleryError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <input
                  type="text"
                  placeholder="Search gallery items..."
                  value={gallerySearchQuery}
                  onChange={(e) => setGallerySearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    background: 'rgba(0, 212, 255, 0.05)',
                    border: '1px solid rgba(0, 212, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'inherit',
                  }}
                />
                <Button onClick={() => {
                  setGalleryFormMode('create');
                  setGalleryForm({ id: '', image_url: '', title: '', description: '', category: 'workshop' });
                  setGalleryFormOpen(true);
                }}>
                  + Add Item
                </Button>
                <Button onClick={() => {
                  document.getElementById('gallery-file-upload').click();
                }} style={{ background: '#00d4ff' }}>
                  📤 Upload Image
                </Button>
                <input
                  id="gallery-file-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setGalleryForm({ id: '', image_url: '', title: file.name.replace(/\.[^.]*$/, ''), description: '', category: 'workshop' });
                      setGalleryUploadFile(file);
                      setGalleryFormOpen(true);
                    }
                  }}
                />
              </div>

              {galleryLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', opacity: 0.6 }}>Loading gallery...</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                  {gallery.map((item) => (
                    <div key={item.id} className="glass" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                      <img src={item.image_url} alt={item.title}style={{ width: '100%', height: '180px', objectFit: 'cover' }}onError={(e) => { if (e.currentTarget.dataset.fallbackApplied) return;
    e.currentTarget.dataset.fallbackApplied = '1';
    e.currentTarget.src = '/assets/default-placeholder.svg';
  }}
/>
                      <div style={{ padding: '16px' }}>
                        <h3 style={{ marginBottom: '8px', fontSize: '0.95rem' }}>{item.title}</h3>
                        <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '12px' }}>{item.category}</p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Button variant="small" onClick={() => { setSelectedGalleryItem(item); }} style={{ flex: 1, fontSize: '0.8rem', padding: '6px' }}>Edit</Button>
                          <Button variant="small" onClick={() => setGalleryDeleteConfirm(item.id)} style={{ flex: 1, fontSize: '0.8rem', padding: '6px', background: '#FF3333' }}>Delete</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {gallery.length === 0 && !galleryLoading && (
                <div style={{ textAlign: 'center', padding: '60px 20px', opacity: 0.6 }}>No gallery items yet</div>
              )}
            </>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <>
              <h1>Analytics & Reports</h1>

              <div className="dashboard-stats">
                <div className="stat-box glass">
                  <div className="stat-info">
                    <div className="stat-label">Inquiry Distribution (by Service)</div>
                    <div style={{ marginTop: '12px' }}>
                      {Object.entries(serviceStats).length === 0 ? (
                        <div style={{ opacity: 0.6 }}>No inquiry data available.</div>
                      ) : (
                        Object.entries(serviceStats).map(([service, count]) => {
                          const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
                          return (
                            <div key={service} style={{ marginBottom: '10px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <div style={{ color: '#FFD166' }}>{service || 'Unspecified'}</div>
                                <div>{count} · {pct}%</div>
                              </div>
                              <div style={{ height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', marginTop: '6px' }}>
                                <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#00d4ff,#00ff88)', borderRadius: '6px' }} />
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                <div className="stat-box glass">
                  <div className="stat-info">
                    <div className="stat-label">Regional Demand (by Country)</div>
                    <div style={{ marginTop: '12px' }}>
                      {requests.length === 0 ? (
                        <div style={{ opacity: 0.6 }}>No inquiry data available.</div>
                      ) : (
                        (() => {
                          const byCountry = requests.reduce((acc, r) => {
                            const c = (r.country || 'Unknown').trim();
                            acc[c] = (acc[c] || 0) + 1;
                            return acc;
                          }, {});
                          const entries = Object.entries(byCountry).sort((a, b) => b[1] - a[1]);
                          return (
                            <div>
                              {entries.map(([country, count]) => {
                                const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
                                return (
                                  <div key={country} style={{ marginBottom: '10px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                      <div>{country}</div>
                                      <div>{count} · {pct}%</div>
                                    </div>
                                    <div style={{ height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', marginTop: '6px' }}>
                                      <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#ffd166,#ff9f43)', borderRadius: '6px' }} />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()
                      )}
                    </div>
                  </div>
                </div>

              </div>

              <div style={{ marginTop: '18px' }}>
                <div className="glass" style={{ padding: '16px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 600 }}>Summary</div>
                    <div style={{ opacity: 0.8 }}>Total inquiries: {stats.total}</div>
                  </div>
                  <div style={{ marginTop: '12px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ minWidth: '180px' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Pending</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{stats.pending}</div>
                    </div>
                    <div style={{ minWidth: '180px' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Resolved</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{stats.resolved}</div>
                    </div>
                    <div style={{ minWidth: '180px' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Countries</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{stats.countries}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '18px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div className="glass" style={{ flex: '1 1 420px', minWidth: '320px', padding: '12px', borderRadius: '12px' }}>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>Inquiries by Service</div>
                  <div style={{ height: 260 }}>
                    <Bar data={serviceChartData} options={chartOptions} />
                  </div>
                </div>
                <div className="glass" style={{ flex: '1 1 320px', minWidth: '240px', padding: '12px', borderRadius: '12px' }}>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>Requests by Country</div>
                  <div style={{ height: 260 }}>
                    <Pie data={countryChartData} options={chartOptions} />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <>
              <h1>Settings</h1>
              <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Secure dashboard settings and account actions.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    localStorage.removeItem('cybernova_admin_token');
                    window.location.href = '/admin/login';
                  }}
                >
                  Logout
                </Button>
              </div>
            </>
          )}
        </section>
      </div>

      {/* Inquiry Details Modal */}
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
              background: 'rgba(15,17,23,0.98)',
              padding: '32px',
              borderRadius: '12px',
              maxWidth: '640px',
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
                <p style={{ marginTop: '4px' }}>{selectedInquiry.name || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email</label>
                <p style={{ marginTop: '4px' }}>{selectedInquiry.email || 'N/A'}</p>
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

      {/* Delete Confirmation Modal - Inquiries */}
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

      {/* Article Details Modal */}
      {selectedArticle ? (
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
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="glass"
            style={{
              background: 'rgba(15,17,23,0.98)',
              padding: '32px',
              borderRadius: '12px',
              maxWidth: '640px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>Article Details</h2>
              <button onClick={() => setSelectedArticle(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '24px' }}>
                <X />
              </button>
            </div>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Title</label>
                <p style={{ marginTop: '4px', color: '#fff' }}>{selectedArticle.title || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Excerpt</label>
                <p style={{ marginTop: '4px', color: '#fff' }}>{selectedArticle.excerpt || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Author</label>
                <p style={{ marginTop: '4px', color: '#fff' }}>{selectedArticle.author || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Date</label>
                <p style={{ marginTop: '4px', color: '#fff' }}>{selectedArticle.date || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Tags</label>
                <p style={{ marginTop: '4px', color: '#fff' }}>{Array.isArray(selectedArticle.tags) ? selectedArticle.tags.join(', ') : selectedArticle.tags || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status</label>
                <p style={{ marginTop: '4px', color: selectedArticle.status === 'draft' ? '#FFD166' : '#00FF88' }}>{selectedArticle.status || 'published'}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <Button onClick={() => setSelectedArticle(null)}>Close</Button>
              <Button onClick={() => openEditArticle(selectedArticle)}>Edit</Button>
              <Button
                onClick={() => {
                  setArticleDeleteConfirm(selectedArticle.id);
                  setSelectedArticle(null);
                }}
                style={{ background: '#FF3333' }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Article Form Modal */}
      {articleFormOpen ? (
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
          onClick={() => setArticleFormOpen(false)}
        >
          <div
            className="glass"
            style={{
              background: 'rgba(15,17,23,0.98)',
              padding: '32px',
              borderRadius: '12px',
              maxWidth: '720px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>{articleFormMode === 'edit' ? 'Edit Article' : 'New Article'}</h2>
              <button onClick={() => setArticleFormOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '24px' }}>
                <X />
              </button>
            </div>
            <form onSubmit={saveArticle} style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#fff' }}>Title</label>
                <input value={articleForm.title} onChange={(event) => setArticleForm((prev) => ({ ...prev, title: event.target.value }))} style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#fff', color: '#000' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#fff' }}>Excerpt</label>
                <textarea value={articleForm.excerpt} onChange={(event) => setArticleForm((prev) => ({ ...prev, excerpt: event.target.value }))} rows="4" style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#fff', color: '#000' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#fff' }}>Author</label>
                  <input value={articleForm.author} onChange={(event) => setArticleForm((prev) => ({ ...prev, author: event.target.value }))} style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#fff', color: '#000' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#fff' }}>Date</label>
                  <input value={articleForm.date} onChange={(event) => setArticleForm((prev) => ({ ...prev, date: event.target.value }))} placeholder="Mar 2026" style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#fff', color: '#000' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#fff' }}>Link</label>
                  <input value={articleForm.link} onChange={(event) => setArticleForm((prev) => ({ ...prev, link: event.target.value }))} style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#fff', color: '#000' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#fff' }}>Status</label>
                  <select value={articleForm.status} onChange={(event) => setArticleForm((prev) => ({ ...prev, status: event.target.value }))} style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#fff', color: '#000' }}>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#fff' }}>Tags</label>
                  <input value={articleForm.tags} onChange={(event) => setArticleForm((prev) => ({ ...prev, tags: event.target.value }))} placeholder="Threat Hunting, Intel" style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#fff', color: '#000' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#fff' }}>Thumbnail</label>
                  <input value={articleForm.thumbnail} onChange={(event) => setArticleForm((prev) => ({ ...prev, thumbnail: event.target.value }))} placeholder="/assets/articles/example.jpg" style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#fff', color: '#000' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <Button type="submit" disabled={articleSaving}>{articleSaving ? 'Saving...' : 'Save Article'}</Button>
                <Button type="button" onClick={() => setArticleFormOpen(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Article Delete Confirmation Modal */}
      {articleDeleteConfirm ? (
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
          onClick={() => setArticleDeleteConfirm(null)}
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
              Are you sure you want to delete this article? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button onClick={() => setArticleDeleteConfirm(null)}>Cancel</Button>
              <Button
                onClick={() => deleteArticle(articleDeleteConfirm)}
                style={{ background: '#FF3333' }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* SERVICE DETAILS MODAL */}
      {selectedService ? (
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
          onClick={() => setSelectedService(null)}
        >
          <div
            className="glass"
            style={{
              background: 'rgba(15,17,23,0.98)',
              padding: '32px',
              borderRadius: '12px',
              maxWidth: '640px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>Service Details</h2>
              <button onClick={() => setSelectedService(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '24px' }}>
                <X />
              </button>
            </div>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Name</label>
                <p style={{ marginTop: '4px', color: '#fff' }}>{selectedService.name || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Description</label>
                <p style={{ marginTop: '4px', color: '#fff' }}>{selectedService.description || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Icon</label>
                <p style={{ marginTop: '4px', color: '#fff' }}>{selectedService.icon || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Price</label>
                <p style={{ marginTop: '4px', color: '#fff' }}>{selectedService.price || 'N/A'}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <Button onClick={() => setSelectedService(null)}>Close</Button>
              <Button onClick={() => openEditService(selectedService)}>Edit</Button>
              <Button
                onClick={() => {
                  setServiceDeleteConfirm(selectedService.id);
                  setSelectedService(null);
                }}
                style={{ background: '#FF3333' }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* SERVICE FORM MODAL */}
      {serviceFormOpen ? (
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
          onClick={() => setServiceFormOpen(false)}
        >
          <div
            className="glass"
            style={{
              background: 'rgba(15,17,23,0.98)',
              padding: '32px',
              borderRadius: '12px',
              maxWidth: '720px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>{serviceFormMode === 'edit' ? 'Edit Service' : 'New Service'}</h2>
              <button onClick={() => setServiceFormOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '24px' }}>
                <X />
              </button>
            </div>
            <form onSubmit={saveService} style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#fff' }}>Name</label>
                <input value={serviceForm.name} onChange={(event) => setServiceForm((prev) => ({ ...prev, name: event.target.value }))} style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#fff', color: '#000' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#fff' }}>Description</label>
                <textarea value={serviceForm.description} onChange={(event) => setServiceForm((prev) => ({ ...prev, description: event.target.value }))} rows="4" style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#fff', color: '#000' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#fff' }}>Icon</label>
                  <input value={serviceForm.icon} onChange={(event) => setServiceForm((prev) => ({ ...prev, icon: event.target.value }))} placeholder="shield-network" style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#fff', color: '#000' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#fff' }}>Price</label>
                  <input value={serviceForm.price} onChange={(event) => setServiceForm((prev) => ({ ...prev, price: event.target.value }))} placeholder="Custom" style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#fff', color: '#000' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <Button type="submit" disabled={serviceSaving}>{serviceSaving ? 'Saving...' : 'Save Service'}</Button>
                <Button type="button" onClick={() => setServiceFormOpen(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* SERVICE DELETE CONFIRMATION MODAL */}
      {serviceDeleteConfirm ? (
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
          onClick={() => setServiceDeleteConfirm(null)}
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
              Are you sure you want to delete this service? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button onClick={() => setServiceDeleteConfirm(null)}>Cancel</Button>
              <Button
                onClick={() => deleteService(serviceDeleteConfirm)}
                style={{ background: '#FF3333' }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* CASE STUDY DETAILS MODAL */}
      {selectedCaseStudy ? (
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
          onClick={() => setSelectedCaseStudy(null)}
        >
          <div
            className="glass"
            style={{
              background: 'rgba(15,17,23,0.98)',
              padding: '32px',
              borderRadius: '12px',
              maxWidth: '640px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>Case Study Details</h2>
              <button onClick={() => setSelectedCaseStudy(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '24px' }}>
                <X />
              </button>
            </div>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Title</label>
                <p style={{ marginTop: '4px', color: '#fff' }}>{selectedCaseStudy.title || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Client</label>
                <p style={{ marginTop: '4px', color: '#fff' }}>{selectedCaseStudy.client || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Industry</label>
                <p style={{ marginTop: '4px', color: '#fff' }}>{selectedCaseStudy.industry || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Challenge</label>
                <p style={{ marginTop: '4px', color: '#fff', lineHeight: '1.6' }}>{selectedCaseStudy.challenge || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Solution</label>
                <p style={{ marginTop: '4px', color: '#fff', lineHeight: '1.6' }}>{selectedCaseStudy.solution || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Result</label>
                <p style={{ marginTop: '4px', color: '#fff', lineHeight: '1.6' }}>{selectedCaseStudy.result || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Metrics</label>
                <p style={{ marginTop: '4px', color: '#fff' }}>{selectedCaseStudy.metrics || 'N/A'}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <Button onClick={() => setSelectedCaseStudy(null)}>Close</Button>
              <Button onClick={() => openEditCaseStudy(selectedCaseStudy)}>Edit</Button>
              <Button
                onClick={() => {
                  setCaseStudyDeleteConfirm(selectedCaseStudy.id);
                  setSelectedCaseStudy(null);
                }}
                style={{ background: '#FF3333' }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* CASE STUDY FORM MODAL */}
      {caseStudyFormOpen ? (
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
          onClick={() => setCaseStudyFormOpen(false)}
        >
          <div
            className="glass"
            style={{
              background: 'rgba(15,17,23,0.98)',
              padding: '32px',
              borderRadius: '12px',
              maxWidth: '720px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>{caseStudyFormMode === 'edit' ? 'Edit Case Study' : 'New Case Study'}</h2>
              <button onClick={() => setCaseStudyFormOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '24px' }}>
                <X />
              </button>
            </div>
            <form onSubmit={saveCaseStudy} style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#fff' }}>Title</label>
                <input value={caseStudyForm.title} onChange={(event) => setCaseStudyForm((prev) => ({ ...prev, title: event.target.value }))} style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#fff', color: '#000' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#fff' }}>Client</label>
                  <input value={caseStudyForm.client} onChange={(event) => setCaseStudyForm((prev) => ({ ...prev, client: event.target.value }))} style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#fff', color: '#000' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#fff' }}>Industry</label>
                  <input value={caseStudyForm.industry} onChange={(event) => setCaseStudyForm((prev) => ({ ...prev, industry: event.target.value }))} style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#fff', color: '#000' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#fff' }}>Challenge</label>
                <textarea value={caseStudyForm.challenge} onChange={(event) => setCaseStudyForm((prev) => ({ ...prev, challenge: event.target.value }))} rows="3" style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#fff', color: '#000' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#fff' }}>Solution</label>
                <textarea value={caseStudyForm.solution} onChange={(event) => setCaseStudyForm((prev) => ({ ...prev, solution: event.target.value }))} rows="3" style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#fff', color: '#000' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#fff' }}>Result</label>
                <textarea value={caseStudyForm.result} onChange={(event) => setCaseStudyForm((prev) => ({ ...prev, result: event.target.value }))} rows="3" style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#fff', color: '#000' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#fff' }}>Metrics</label>
                <input value={caseStudyForm.metrics} onChange={(event) => setCaseStudyForm((prev) => ({ ...prev, metrics: event.target.value }))} placeholder="Compliance score improved from 72% to 98%" style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#fff', color: '#000' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <Button type="submit" disabled={caseStudySaving}>{caseStudySaving ? 'Saving...' : 'Save Case Study'}</Button>
                <Button type="button" onClick={() => setCaseStudyFormOpen(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* CASE STUDY DELETE CONFIRMATION MODAL */}
      {caseStudyDeleteConfirm ? (
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
          onClick={() => setCaseStudyDeleteConfirm(null)}
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
              Are you sure you want to delete this case study? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button onClick={() => setCaseStudyDeleteConfirm(null)}>Cancel</Button>
              <Button
                onClick={() => deleteCaseStudy(caseStudyDeleteConfirm)}
                style={{ background: '#FF3333' }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* EVENT DETAILS MODAL */}
      {selectedEvent ? (
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
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="glass"
            style={{
              background: 'rgba(15,17,23,0.98)',
              padding: '32px',
              borderRadius: '12px',
              maxWidth: '640px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>Event Details</h2>
              <button onClick={() => setSelectedEvent(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '24px' }}>
                <X />
              </button>
            </div>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Title</label>
                <p style={{ marginTop: '4px', color: '#fff' }}>{selectedEvent.title || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Date</label>
                <p style={{ marginTop: '4px', color: '#fff' }}>{selectedEvent.date || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Time</label>
                <p style={{ marginTop: '4px', color: '#fff' }}>{selectedEvent.time || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Location</label>
                <p style={{ marginTop: '4px', color: '#fff' }}>{selectedEvent.location || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Description</label>
                <p style={{ marginTop: '4px', color: '#fff', lineHeight: '1.6' }}>{selectedEvent.description || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Link</label>
                <p style={{ marginTop: '4px', color: '#fff' }}>{selectedEvent.link || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status</label>
                <p style={{ marginTop: '4px', color: selectedEvent.status === 'past' ? '#FFD166' : '#00FF88' }}>{selectedEvent.status || 'upcoming'}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <Button onClick={() => setSelectedEvent(null)}>Close</Button>
              <Button onClick={() => openEditEvent(selectedEvent)}>Edit</Button>
              <Button
                onClick={() => {
                  setEventDeleteConfirm(selectedEvent.id);
                  setSelectedEvent(null);
                }}
                style={{ background: '#FF3333' }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* EVENT FORM MODAL */}
      {eventFormOpen ? (
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
          onClick={() => setEventFormOpen(false)}
        >
          <div
            className="glass"
            style={{
              background: 'rgba(15,17,23,0.98)',
              padding: '32px',
              borderRadius: '12px',
              maxWidth: '720px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>{eventFormMode === 'edit' ? 'Edit Event' : 'New Event'}</h2>
              <button onClick={() => setEventFormOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '24px' }}>
                <X />
              </button>
            </div>
            <form onSubmit={saveEvent} style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#fff' }}>Title</label>
                <input value={eventForm.title} onChange={(event) => setEventForm((prev) => ({ ...prev, title: event.target.value }))} style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#fff', color: '#000' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#fff' }}>Date</label>
                  <input value={eventForm.date} onChange={(event) => setEventForm((prev) => ({ ...prev, date: event.target.value }))} type="date" style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#fff', color: '#000' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#fff' }}>Time</label>
                  <input value={eventForm.time} onChange={(event) => setEventForm((prev) => ({ ...prev, time: event.target.value }))} type="time" style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#fff', color: '#000' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#fff' }}>Location</label>
                <input value={eventForm.location} onChange={(event) => setEventForm((prev) => ({ ...prev, location: event.target.value }))} style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#fff', color: '#000' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#fff' }}>Description</label>
                <textarea value={eventForm.description} onChange={(event) => setEventForm((prev) => ({ ...prev, description: event.target.value }))} rows="4" style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#fff', color: '#000' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#fff' }}>Link</label>
                  <input value={eventForm.link} onChange={(event) => setEventForm((prev) => ({ ...prev, link: event.target.value }))} placeholder="https://example.com/event" style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#fff', color: '#000' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#fff' }}>Status</label>
                  <select value={eventForm.status} onChange={(event) => setEventForm((prev) => ({ ...prev, status: event.target.value }))} style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#fff', color: '#000' }}>
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <Button type="submit" disabled={eventSaving}>{eventSaving ? 'Saving...' : 'Save Event'}</Button>
                <Button type="button" onClick={() => setEventFormOpen(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* EVENT DELETE CONFIRMATION MODAL */}
      {eventDeleteConfirm ? (
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
          onClick={() => setEventDeleteConfirm(null)}
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
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button onClick={() => setEventDeleteConfirm(null)}>Cancel</Button>
              <Button
                onClick={() => deleteEvent(eventDeleteConfirm)}
                style={{ background: '#FF3333' }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Feedback Delete Confirmation Modal */}
      {feedbackDeleteConfirm ? (
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
          onClick={() => setFeedbackDeleteConfirm(null)}
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
              Are you sure you want to delete this feedback? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button onClick={() => setFeedbackDeleteConfirm(null)}>Cancel</Button>
              <Button
                onClick={() => deleteFeedback(feedbackDeleteConfirm)}
                style={{ background: '#FF3333' }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Gallery Delete Confirmation Modal */}
      {galleryDeleteConfirm ? (
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
          onClick={() => setGalleryDeleteConfirm(null)}
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
              Are you sure you want to delete this gallery item? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button onClick={() => setGalleryDeleteConfirm(null)}>Cancel</Button>
              <Button
                onClick={() => deleteGalleryItem(galleryDeleteConfirm)}
                style={{ background: '#FF3333' }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Gallery Form Modal */}
      {galleryFormOpen ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1999,
          }}
          onClick={() => setGalleryFormOpen(false)}
        >
          <div
            className="glass"
            style={{
              padding: '32px',
              borderRadius: '12px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: '24px' }}>
              {galleryFormMode === 'create' ? 'Add Gallery Item' : 'Edit Gallery Item'}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (galleryUploadFile) {
                  uploadGalleryImage(galleryUploadFile);
                } else {
                  createGalleryItem();
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {galleryUploadFile ? (
                <div style={{ padding: '12px', background: 'rgba(0,212,255,0.1)', borderRadius: '6px', border: '1px solid rgba(0,212,255,0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span>📁 {galleryUploadFile.name}</span>
                    <button type="button" onClick={() => { setGalleryUploadFile(null); document.getElementById('gallery-file-upload').value = ''; }} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#00d4ff', cursor: 'pointer' }}>✕</button>
                  </div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>{(galleryUploadFile.size / 1024).toFixed(2)} KB</div>
                </div>
              ) : (
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Image URL *</label>
                <input
                  value={galleryForm.image_url}
                  onChange={(e) => setGalleryForm((prev) => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(0, 212, 255, 0.05)',
                    border: '1px solid rgba(0, 212, 255, 0.2)',
                    borderRadius: '6px',
                    color: 'inherit',
                  }}
                  disabled={gallerySaving}
                  required={!galleryUploadFile}
                />
              </div>
              )}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Or Choose Image File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setGalleryUploadFile(file);
                      setGalleryForm(prev => ({ ...prev, title: prev.title || file.name.replace(/\.[^.]*$/, '') }));
                    }
                  }}
                  disabled={gallerySaving}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(0, 212, 255, 0.05)',
                    border: '1px solid rgba(0, 212, 255, 0.2)',
                    borderRadius: '6px',
                    color: 'inherit',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Title *</label>
                <input
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Gallery item title"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(0, 212, 255, 0.05)',
                    border: '1px solid rgba(0, 212, 255, 0.2)',
                    borderRadius: '6px',
                    color: 'inherit',
                  }}
                  disabled={gallerySaving}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Description</label>
                <textarea
                  value={galleryForm.description || ''}
                  onChange={(e) => setGalleryForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional description"
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(0, 212, 255, 0.05)',
                    border: '1px solid rgba(0, 212, 255, 0.2)',
                    borderRadius: '6px',
                    color: 'inherit',
                    fontFamily: 'inherit',
                  }}
                  disabled={gallerySaving}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Category</label>
                <select
                  value={galleryForm.category}
                  onChange={(e) => setGalleryForm((prev) => ({ ...prev, category: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(0, 212, 255, 0.05)',
                    border: '1px solid rgba(0, 212, 255, 0.2)',
                    borderRadius: '6px',
                    color: 'inherit',
                  }}
                  disabled={gallerySaving}
                >
                  <option value="workshop">Workshop</option>
                  <option value="training">Training</option>
                  <option value="event">Event</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button type="submit" disabled={gallerySaving}>
                  {gallerySaving ? 'Saving...' : 'Save'}
                </Button>
                <Button type="button" onClick={() => {
                  setGalleryFormOpen(false);
                  setGalleryUploadFile(null);
                }}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Feedback View Modal */}
      {selectedFeedback ? (
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
          onClick={() => setSelectedFeedback(null)}
        >
          <div
            className="glass"
            style={{
              padding: '32px',
              borderRadius: '12px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: '24px' }}>{selectedFeedback.name}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email</label>
                <p style={{ marginTop: '4px' }}>{selectedFeedback.email}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Company</label>
                <p style={{ marginTop: '4px' }}>{selectedFeedback.company || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Role</label>
                <p style={{ marginTop: '4px' }}>{selectedFeedback.role || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Rating</label>
                <p style={{ marginTop: '4px' }}>{'★'.repeat(selectedFeedback.rating)}</p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Feedback</label>
                <p style={{ marginTop: '4px', lineHeight: '1.6' }}>{selectedFeedback.comment}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status</label>
                <p style={{ marginTop: '4px', color: statusStyles[selectedFeedback.status]?.color }}>
                  {selectedFeedback.status}
                </p>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Submitted</label>
                <p style={{ marginTop: '4px' }}>
                  {new Date(selectedFeedback.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button onClick={() => setSelectedFeedback(null)}>Close</Button>
              <Button
                onClick={() => {
                  const nextStatus = selectedFeedback.status === 'approved' ? 'rejected' : 'approved';
                  (async () => {
                    try {
                      const response = await fetch(`${apiBase}/feedback/${selectedFeedback.id}/status`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ status: nextStatus }),
                      });
                      if (response.ok) {
                        const updated = await response.json();
                        setFeedback(prev => prev.map(f => f.id === selectedFeedback.id ? updated : f));
                        setSelectedFeedback(updated);
                      }
                    } catch (err) {
                      setFeedbackError(err.message);
                    }
                  })();
                }}
                style={{ background: selectedFeedback.status === 'approved' ? '#FF9500' : '#00FF88' }}
              >
                {selectedFeedback.status === 'approved' ? 'Reject' : 'Approve'}
              </Button>
              <Button
                onClick={() => {
                  setFeedbackDeleteConfirm(selectedFeedback.id);
                  setSelectedFeedback(null);
                }}
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
