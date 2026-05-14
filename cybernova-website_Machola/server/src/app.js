import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// Use the updated inquiries router (new InquiryModel handling)
import inquiryRouter from './routes/inquiryRoutes-updated.js';
import articleRouter from './routes/articleRoutes.js';
import serviceRouter from './routes/serviceRoutes.js';
import caseStudyRouter from './routes/caseStudyRoutes.js';
import eventRouter from './routes/eventRoutes.js';
import feedbackRouter from './routes/feedbackRoutes.js';
import galleryRouter from './routes/galleryRoutes.js';
import authRouter from './routes/authRoutes.js';

const app = express();
const projectRoot = path.resolve(process.cwd(), '..');
const distPath = path.join(projectRoot, 'dist');

// CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5999',
      'https://lesleymachoal.github.io',
      'https://lesleymachoal.github.io/cybernova-website/'
    ];
    
    // Allow no origin (mobile apps, curl requests, same-origin requests)
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else if (process.env.NODE_ENV === 'production' && origin && origin.includes('render.com')) {
      // Allow all Render subdomains in production
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));
// Serve built frontend if available (production)
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.get('/favicon.ico', (_req, res) => {
    res.status(204).end();
  });

  // API health
  app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/inquiries', inquiryRouter);
  app.use('/api/articles', articleRouter);
  app.use('/api/services', serviceRouter);
  app.use('/api/case-studies', caseStudyRouter);
  app.use('/api/events', eventRouter);
  app.use('/api/feedback', feedbackRouter);
  app.use('/api/gallery', galleryRouter);

  // SPA fallback
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Development / fallback: serve project root (keeps prior behavior)
  app.use(express.static(projectRoot));

  app.get('/favicon.ico', (_req, res) => {
    res.status(204).end();
  });

  app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/inquiries', inquiryRouter);
  app.use('/api/articles', articleRouter);
  app.use('/api/services', serviceRouter);
  app.use('/api/case-studies', caseStudyRouter);
  app.use('/api/feedback', feedbackRouter);
  app.use('/api/events', eventRouter);
  app.use('/api/gallery', galleryRouter);
}

export default app;
