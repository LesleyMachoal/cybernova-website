-- CyberNova Website - Supabase Schema
-- This SQL script creates all necessary tables and seeds them with data
-- Run this in your Supabase SQL Editor

-- ============================================================================
-- TABLE: admin_users
-- ============================================================================
DROP TABLE IF EXISTS public.admin_users CASCADE;

CREATE TABLE public.admin_users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_admin_users_username ON public.admin_users(username);

-- ============================================================================
-- TABLE: contact_inquiries
-- ============================================================================
DROP TABLE IF EXISTS public.contact_inquiries CASCADE;

CREATE TABLE public.contact_inquiries (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  organization VARCHAR(255),
  job_title VARCHAR(255),
  country VARCHAR(100),
  issue_type VARCHAR(100),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contact_inquiries_status ON public.contact_inquiries(status);
CREATE INDEX idx_contact_inquiries_submitted_at ON public.contact_inquiries(submitted_at);
CREATE INDEX idx_contact_inquiries_email ON public.contact_inquiries(email);

-- ============================================================================
-- TABLE: feedback
-- ============================================================================
DROP TABLE IF EXISTS public.feedback CASCADE;

CREATE TABLE public.feedback (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  role VARCHAR(255),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  source_inquiry_id BIGINT UNIQUE REFERENCES public.contact_inquiries(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_feedback_status ON public.feedback(status);
CREATE INDEX idx_feedback_created_at ON public.feedback(created_at);
CREATE INDEX idx_feedback_rating ON public.feedback(rating);

-- ============================================================================
-- TABLE: gallery_items
-- ============================================================================
DROP TABLE IF EXISTS public.gallery_items CASCADE;

CREATE TABLE public.gallery_items (
  id BIGSERIAL PRIMARY KEY,
  image_url VARCHAR(500) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gallery_items_category ON public.gallery_items(category);
CREATE INDEX idx_gallery_items_created_at ON public.gallery_items(created_at);

-- ============================================================================
-- TABLE: articles
-- ============================================================================
DROP TABLE IF EXISTS public.articles CASCADE;

CREATE TABLE public.articles (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  excerpt VARCHAR(500),
  author VARCHAR(255),
  date DATE DEFAULT CURRENT_DATE,
  link VARCHAR(500),
  tags VARCHAR(255),
  thumbnail VARCHAR(500),
  status VARCHAR(50) DEFAULT 'published',
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_articles_status ON public.articles(status);
CREATE INDEX idx_articles_date ON public.articles(date);
CREATE INDEX idx_articles_author ON public.articles(author);

-- ============================================================================
-- TABLE: services
-- ============================================================================
DROP TABLE IF EXISTS public.services CASCADE;

CREATE TABLE public.services (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  price VARCHAR(50),
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_services_name ON public.services(name);

-- ============================================================================
-- TABLE: case_studies
-- ============================================================================
DROP TABLE IF EXISTS public.case_studies CASCADE;

CREATE TABLE public.case_studies (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  client VARCHAR(255),
  industry VARCHAR(100),
  challenge TEXT,
  solution TEXT,
  result TEXT,
  metrics VARCHAR(255),
  thumbnail VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_case_studies_industry ON public.case_studies(industry);
CREATE INDEX idx_case_studies_created_at ON public.case_studies(created_at);

-- ============================================================================
-- TABLE: events
-- ============================================================================
DROP TABLE IF EXISTS public.events CASCADE;

CREATE TABLE public.events (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time TIME,
  location VARCHAR(255),
  description TEXT,
  link VARCHAR(500),
  status VARCHAR(50) DEFAULT 'upcoming',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_date ON public.events(date);

-- ============================================================================
-- TABLE: site_content
-- ============================================================================
DROP TABLE IF EXISTS public.site_content CASCADE;

CREATE TABLE public.site_content (
  id BIGSERIAL PRIMARY KEY,
  key VARCHAR(100) NOT NULL UNIQUE,
  content TEXT,
  section VARCHAR(100),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_site_content_key ON public.site_content(key);
CREATE INDEX idx_site_content_section ON public.site_content(section);

-- ============================================================================
-- SEED DATA: admin_users
-- ============================================================================
INSERT INTO public.admin_users (username, password_hash, email, role, is_active) VALUES
('admin', '$2a$10$f.Ma37fMm/eb4IDagPc2Ie4KxEy8m4Zpa496PjRCbLQqvxlq8D1ae', 'admin@cybernova.com', 'admin', true),
('analyst', '$2a$10$f.Ma37fMm/eb4IDagPc2Ie4KxEy8m4Zpa496PjRCbLQqvxlq8D1ae', 'analyst@cybernova.com', 'analyst', true);

-- ============================================================================
-- SEED DATA: contact_inquiries
-- ============================================================================
INSERT INTO public.contact_inquiries (name, email, phone, organization, job_title, country, issue_type, description, status) VALUES
('John Smith', 'john.smith@acme.com', '+1-555-0101', 'Acme Corporation', 'Security Manager', 'United States', 'Network Security', 'Looking for enterprise network security solutions', 'pending'),
('Sarah Johnson', 'sarah@techcorp.net', '+1-555-0102', 'TechCorp Inc', 'IT Director', 'Canada', 'Endpoint Protection', 'Need protection for 500+ endpoints', 'approved'),
('Michael Chen', 'mchen@finbank.com', '+86-10-5555-0103', 'FinBank Ltd', 'Chief Security Officer', 'China', 'Compliance', 'GDPR and CCPA compliance audit needed', 'pending'),
('Emma Wilson', 'emma.wilson@retailco.uk', '+44-20-5555-0104', 'RetailCo Ltd', 'Operations Manager', 'United Kingdom', 'Incident Response', 'Had a breach, need investigation', 'approved'),
('David Martinez', 'david@healthcaresys.es', '+34-91-5555-0105', 'HealthcareSys', 'IT Security Lead', 'Spain', 'Data Protection', 'HIPAA compliance for healthcare data', 'pending'),
('Lisa Anderson', 'lisa.a@globaltech.jp', '+81-3-5555-0106', 'GlobalTech Solutions', 'VP Security', 'Japan', 'Network Security', 'Multi-site VPN and firewall architecture', 'approved'),
('Robert Taylor', 'robert.taylor@defenseinc.com', '+1-555-0107', 'Defense Inc', 'Security Architect', 'United States', 'Cloud Security', 'AWS and Azure security assessment', 'pending'),
('Maria Garcia', 'maria@energycorp.br', '+55-11-5555-0108', 'EnergyCorp', 'CISO', 'Brazil', 'Security Awareness', 'Employee training program', 'approved'),
('James Wilson', 'james.w@automotiveltd.de', '+49-30-5555-0109', 'AutomotiveLTD', 'Security Officer', 'Germany', 'Vulnerability Management', 'Automated vulnerability scanning', 'pending'),
('Patricia Lee', 'plee@manufacturingco.au', '+61-2-5555-0110', 'ManufacturingCo', 'Operations Head', 'Australia', 'Incident Response', 'Ransomware protection consultation', 'pending'),
('Christopher Martinez', 'chris@pharmatech.ca', '+1-555-0111', 'PharmaTech', 'IT Manager', 'Canada', 'Compliance', 'SOC 2 Type II audit', 'approved'),
('Jennifer Brown', 'jennifer@financialservices.sg', '+65-5555-0112', 'Financial Services SG', 'Risk Manager', 'Singapore', 'Risk Assessment', 'Comprehensive security risk assessment', 'pending');

-- ============================================================================
-- SEED DATA: feedback
-- ============================================================================
INSERT INTO public.feedback (name, email, company, role, rating, comment, status) VALUES
('Alex Thompson', 'alex@company1.com', 'Company One', 'Security Lead', 5, 'Outstanding service! Helped us secure our infrastructure within weeks.', 'approved'),
('Brenda Mitchell', 'brenda@company2.com', 'Company Two', 'CTO', 4, 'Professional team, excellent response time. Minor issues with documentation.', 'approved'),
('Carlos Rodriguez', 'carlos@company3.es', 'Company Three', 'IT Director', 5, 'Transformó nuestra postura de seguridad. Muy recomendado.', 'approved'),
('Diana Foster', 'diana@company4.com', 'Company Four', 'Security Manager', 3, 'Good service but could improve their consultation process.', 'pending'),
('Edward Kim', 'edward@company5.kr', 'Company Five', 'Compliance Officer', 5, 'Exceeded expectations. Fast, professional, and results-oriented.', 'approved'),
('Fiona Grey', 'fiona@company6.uk', 'Company Six', 'Operations Manager', 4, 'Reliable partner for our security needs. Great team.', 'approved'),
('George Nakamura', 'george@company7.jp', 'Company Seven', 'CISO', 5, 'Best investment in security we have made. Highly professional.', 'approved'),
('Hannah Lopez', 'hannah@company8.mx', 'Company Eight', 'IT Security Specialist', 4, 'Very good services. Wish they had more regional support.', 'pending'),
('Isaac Chen', 'isaac@company9.tw', 'Company Nine', 'Risk Manager', 5, 'Exceptional team. Solved our security challenges quickly.', 'approved'),
('Jasmine Patel', 'jasmine@company10.in', 'Company Ten', 'IT Manager', 4, 'Professional and knowledgeable. Would work with them again.', 'approved'),
('Kevin O''Brien', 'kevin@company11.ie', 'Company Eleven', 'Security Architect', 5, 'Top-tier security consultancy. Highly recommended.', 'approved'),
('Laura Bergstrom', 'laura@company12.se', 'Company Twelve', 'Compliance Lead', 3, 'Decent services, but pricing could be more competitive.', 'pending');

-- ============================================================================
-- SEED DATA: gallery_items
-- ============================================================================
INSERT INTO public.gallery_items (image_url, title, description, category) VALUES
('/uploads/gallery/1.jpg', 'Annual Security Summit 2025', 'CyberNova hosts industry leaders discussing latest threats', 'Conference'),
('/uploads/gallery/2.jpg', 'Incident Response Training', 'Hands-on training session for rapid response teams', 'Training'),
('/uploads/gallery/3.jpg', 'Security Awareness Workshop', 'Employee education on phishing and social engineering', 'Workshop'),
('/uploads/gallery/4.jpg', 'Penetration Testing Lab', 'Advanced ethical hacking certification program', 'Lab'),
('/uploads/gallery/5.jpg', 'Cloud Security Assessment', 'Team conducting security audit on cloud infrastructure', 'Audit'),
('/uploads/gallery/6.jpg', 'Network Architecture Review', 'Expert examining enterprise network security design', 'Consulting'),
('/uploads/gallery/7.jpg', 'Threat Intelligence Briefing', 'Analysis of emerging cyber threats and vulnerabilities', 'Briefing'),
('/uploads/gallery/8.jpg', 'Compliance Documentation Review', 'Preparing audit documents for SOC 2 certification', 'Compliance'),
('/uploads/gallery/9.jpg', 'Security Operations Center', 'Our 24/7 NOC monitoring global client infrastructure', 'Facilities'),
('/uploads/gallery/10.jpg', 'Red Team Exercise', 'Simulated attack testing organization security defenses', 'Exercise'),
('/uploads/gallery/11.jpg', 'Cybersecurity Summit Panel', 'Industry experts discussing digital transformation risks', 'Conference'),
('/uploads/gallery/12.jpg', 'Risk Assessment Workshop', 'Interactive session on identifying security gaps', 'Workshop');

-- ============================================================================
-- SEED DATA: articles
-- ============================================================================
INSERT INTO public.articles (title, excerpt, author, date, tags, status, content) VALUES
('Top 10 Cybersecurity Trends in 2025', 'Discover the latest trends shaping the cybersecurity landscape', 'Sarah Chen', '2025-01-15', 'trends,security,2025', 'published', 'Comprehensive analysis of emerging cybersecurity trends...'),
('Zero Trust Architecture Explained', 'A deep dive into implementing zero trust security models', 'Michael Adams', '2025-01-20', 'zero-trust,architecture,security', 'published', 'Zero Trust is no longer optional. Learn how to implement it...'),
('Ransomware Prevention Best Practices', 'Strategies to defend against ransomware attacks', 'Jennifer Lee', '2025-01-25', 'ransomware,defense,prevention', 'published', 'Ransomware attacks continue to rise. Here are key defenses...'),
('Cloud Security Essentials', 'Securing your cloud infrastructure in 2025', 'David Martinez', '2025-02-01', 'cloud,security,aws,azure', 'published', 'Cloud security requires a different approach. Learn key principles...'),
('API Security Vulnerabilities', 'Common API security issues and how to fix them', 'Lisa Wang', '2025-02-05', 'api,security,vulnerabilities', 'published', 'APIs are frequently targeted. Discover common attack vectors...'),
('Incident Response Planning', 'Building an effective incident response program', 'Robert Thompson', '2025-02-10', 'incident-response,planning,security', 'published', 'A well-prepared incident response plan saves time and money...'),
('GDPR Compliance Checklist', 'Essential steps for GDPR compliance', 'Emily Johnson', '2025-02-15', 'gdpr,compliance,privacy', 'published', 'GDPR compliance is mandatory. Use our checklist...'),
('Phishing Attack Prevention', 'How to protect your organization from phishing', 'James Wilson', '2025-02-20', 'phishing,awareness,security', 'published', 'Phishing remains the top attack vector. Learn prevention tactics...'),
('Threat Intelligence Basics', 'Understanding and utilizing threat intelligence', 'Nina Patel', '2025-02-25', 'threat-intelligence,analysis', 'published', 'Effective threat intelligence empowers your security team...'),
('Security Metrics That Matter', 'Key performance indicators for your security program', 'Patrick O''Brien', '2025-03-01', 'metrics,measurement,security', 'published', 'Measuring security effectiveness is critical for continuous improvement...'),
('IoT Security Challenges', 'Securing the Internet of Things in enterprise', 'Amanda Scott', '2025-03-05', 'iot,security,challenges', 'published', 'IoT devices introduce new security challenges to enterprises...'),
('Supply Chain Security', 'Protecting against third-party security risks', 'Victor Gonzalez', '2025-03-10', 'supply-chain,risk,security', 'published', 'Supply chain attacks are increasing. Learn how to defend...');

-- ============================================================================
-- SEED DATA: services
-- ============================================================================
INSERT INTO public.services (name, description, icon, price, details) VALUES
('Network Security', 'Firewall, intrusion detection, VPN management', 'Shield', '$5,000/month', 'Enterprise-grade network protection with 24/7 monitoring'),
('Endpoint Protection', 'Antivirus, malware defense, device management', 'Lock', '$3,000/month', 'Protect all endpoints from advanced threats'),
('Cloud Security', 'AWS, Azure, GCP security audits and hardening', 'Cloud', '$4,000/month', 'Secure your cloud infrastructure comprehensively'),
('Incident Response', 'Breach investigation, forensics, recovery', 'Alert', '$8,000/incident', 'Rapid response to security incidents 24/7'),
('Penetration Testing', 'Ethical hacking, vulnerability assessment', 'Target', '$6,000/assessment', 'Identify vulnerabilities before attackers do'),
('Security Compliance', 'SOC 2, ISO 27001, HIPAA, GDPR compliance', 'CheckCircle', '$2,500/month', 'Achieve and maintain security compliance standards'),
('Security Awareness Training', 'Employee education, phishing simulations', 'Users', '$1,500/month', 'Build a security-conscious workforce'),
('Managed SOC', '24/7 security operations center management', 'Monitor', '$7,000/month', 'Round-the-clock threat monitoring and response'),
('Vulnerability Management', 'Scanning, assessment, remediation tracking', 'AlertTriangle', '$2,000/month', 'Continuous vulnerability identification and management'),
('Security Consulting', 'Strategy, architecture, risk assessment', 'Lightbulb', '$250/hour', 'Expert guidance on your security strategy');

-- ============================================================================
-- SEED DATA: case_studies
-- ============================================================================
INSERT INTO public.case_studies (title, client, industry, challenge, solution, result, metrics) VALUES
('Financial Institution Zero Trust Implementation', 'Global Bank Corp', 'Finance', 'Legacy network with weak access controls exposed to threats', 'Implemented zero trust architecture with modern IAM', 'Eliminated unauthorized access incidents', 'Zero breaches, 99.9% uptime'),
('Healthcare HIPAA Compliance Transformation', 'MediCare Health Systems', 'Healthcare', 'Non-compliant infrastructure risked patient data exposure', 'Full HIPAA compliance audit and remediation', 'Achieved SOC 2 Type II certification', '100% compliance, zero violations'),
('Retail Chain Ransomware Recovery', 'RetailHub International', 'Retail', 'Ransomware attack across 200+ stores', 'Rapid incident response and infrastructure hardening', 'Restored operations in 48 hours', '97% data recovery'),
('Manufacturing Supply Chain Security', 'IndustrialTech Solutions', 'Manufacturing', 'Vulnerable suppliers compromised main systems', 'Implemented supplier security assessment program', 'Eliminated third-party breaches', '40+ suppliers verified'),
('Tech Startup Rapid Growth Security', 'CloudStart Innovations', 'Technology', 'Scaling without security controls', 'Built security program from ground up', 'Reached enterprise security maturity level 4', 'Series B ready'),
('Government Agency Risk Assessment', 'National Security Department', 'Government', 'Critical infrastructure at risk from nation-state actors', 'Comprehensive red team exercise and hardening', 'Defeated simulated advanced attacks', 'Infrastructure hardened'),
('Telecom Network Threat Response', 'Global Telecom Inc', 'Telecommunications', 'DDoS attacks and insider threats', 'Advanced threat detection and response system', 'DDoS mitigation in real-time', 'Attack response time: 2 minutes'),
('E-commerce Data Breach Prevention', 'OnlineStore Premium', 'E-commerce', 'Payment card data at risk', 'PCI DSS compliance and security hardening', 'Achieved PCI Level 1 compliance', 'Zero data loss'),
('Educational Institution Cloud Migration', 'State University System', 'Education', 'Unsecured on-premise infrastructure', 'Secure cloud migration with security posture management', 'All systems moved securely', 'Cost reduced 30%'),
('Energy Sector OT Security', 'PowerGrid Solutions', 'Energy', 'Operational technology vulnerabilities', 'ICS/SCADA security assessment and remediation', 'Critical infrastructure secured', 'Uptime maintained at 99.95%');

-- ============================================================================
-- SEED DATA: events
-- ============================================================================
INSERT INTO public.events (title, date, time, location, description, status) VALUES
('Cybersecurity Summit 2025', '2025-04-15', '09:00:00', 'San Francisco, CA', 'Annual conference with industry experts discussing latest threats and solutions', 'upcoming'),
('Penetration Testing Workshop', '2025-04-22', '10:00:00', 'Virtual', 'Hands-on training in ethical hacking and penetration testing techniques', 'upcoming'),
('Cloud Security Bootcamp', '2025-05-01', '09:00:00', 'New York, NY', 'Intensive 3-day training on securing cloud infrastructure', 'upcoming'),
('GDPR Compliance Webinar', '2025-05-08', '14:00:00', 'Virtual', 'Expert discussion on GDPR compliance requirements and best practices', 'upcoming'),
('Incident Response Simulation', '2025-05-15', '10:00:00', 'Chicago, IL', 'Realistic incident response tabletop exercise and training', 'upcoming'),
('Zero Trust Architecture Talk', '2025-05-22', '11:00:00', 'Virtual', 'Deep dive into implementing zero trust security models', 'upcoming'),
('Security Operations Center Tour', '2025-06-01', '10:00:00', 'Austin, TX', 'Behind-the-scenes tour of our 24/7 security operations center', 'upcoming'),
('Ransomware Defense Roundtable', '2025-06-10', '13:00:00', 'Boston, MA', 'Executive roundtable on ransomware prevention and recovery', 'upcoming'),
('API Security Conference', '2025-06-20', '09:00:00', 'Seattle, WA', 'Conference focused on modern API security challenges and solutions', 'upcoming'),
('Threat Intelligence Workshop', '2025-07-01', '10:00:00', 'Virtual', 'Learn threat intelligence gathering and analysis techniques', 'upcoming'),
('Security Awareness Training', '2025-07-15', '09:00:00', 'Multiple Locations', 'Employee security awareness and phishing prevention training', 'upcoming'),
('Supply Chain Security Seminar', '2025-07-29', '14:00:00', 'Denver, CO', 'Securing third-party vendors and supply chain risks', 'upcoming');

-- ============================================================================
-- SEED DATA: site_content
-- ============================================================================
INSERT INTO public.site_content (key, content, section) VALUES
('hero_title', 'Cyber Security Excellence', 'hero'),
('hero_subtitle', 'Protect your organization from evolving cyber threats', 'hero'),
('hero_cta', 'Get Started Today', 'hero'),
('about_title', 'About CyberNova', 'about'),
('about_description', 'Founded in 2015, CyberNova is a leading cybersecurity firm protecting enterprises globally', 'about'),
('mission_statement', 'To empower organizations with world-class security solutions', 'company'),
('vision_statement', 'A world where cyber threats are neutralized before they impact business', 'company'),
('contact_intro', 'Let us help you secure your digital assets', 'contact'),
('footer_copyright', '© 2025 CyberNova Security. All rights reserved.', 'footer'),
('footer_tagline', 'Your trusted cybersecurity partner', 'footer'),
('homepage_featured_service', 'Network Security', 'homepage'),
('testimonials_intro', 'Trusted by leading organizations worldwide', 'testimonials');

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) - Optional but Recommended
-- ============================================================================
-- Uncomment to enable RLS policies
-- ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
