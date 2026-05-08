import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'server', 'data');
const ARTICLE_FILE = path.join(DATA_DIR, 'articles.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(ARTICLE_FILE)) {
    const seedArticles = [
      {
        id: 'threat-hunting-in-2026',
        title: 'Threat Hunting in 2026',
        excerpt: 'How to find advanced threats early',
        author: 'R. Singh',
        date: 'Mar 2026',
        link: '#',
        tags: ['Threat Hunting', 'Intel'],
        thumbnail: '/assets/articles/threat-hunting.jpg',
        status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'soc-modernisation',
        title: 'SOC Modernisation',
        excerpt: 'Building an efficient security operations centre',
        author: 'L. Patel',
        date: 'Feb 2026',
        link: '#',
        tags: ['SOC', 'Ops'],
        thumbnail: '/assets/articles/soc-modern.jpg',
        status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    fs.writeFileSync(ARTICLE_FILE, JSON.stringify(seedArticles, null, 2), 'utf8');
  }
}

function readLocalArticles() {
  ensureDataFile();
  const raw = fs.readFileSync(ARTICLE_FILE, 'utf8');

  try {
    return JSON.parse(raw || '[]');
  } catch (_error) {
    return [];
  }
}

function writeLocalArticles(arr) {
  ensureDataFile();
  fs.writeFileSync(ARTICLE_FILE, JSON.stringify(arr, null, 2), 'utf8');
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `article-${Date.now()}`;
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean);
  }

  if (typeof tags === 'string') {
    return tags.split(',').map((tag) => tag.trim()).filter(Boolean);
  }

  return [];
}

export class ArticleModel {
  static async getAllArticles() {
    const list = readLocalArticles();
    return list.sort((a, b) => new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0));
  }

  static async getArticle(id) {
    const list = readLocalArticles();
    const article = list.find((item) => String(item.id) === String(id));
    if (!article) {
      throw new Error('Article not found');
    }
    return article;
  }

  static async createArticle(payload) {
    const list = readLocalArticles();
    const now = new Date().toISOString();
    const title = String(payload.title || '').trim();

    if (!title) {
      throw new Error('Article title is required');
    }

    const entry = {
      id: payload.id ? String(payload.id) : slugify(title),
      title,
      excerpt: String(payload.excerpt || '').trim(),
      author: String(payload.author || '').trim(),
      date: String(payload.date || '').trim(),
      link: String(payload.link || '#').trim() || '#',
      tags: normalizeTags(payload.tags),
      thumbnail: String(payload.thumbnail || '').trim(),
      status: payload.status === 'draft' ? 'draft' : 'published',
      created_at: now,
      updated_at: now,
    };

    const existingIndex = list.findIndex((item) => String(item.id) === String(entry.id));
    if (existingIndex !== -1) {
      throw new Error('An article with this ID already exists');
    }

    list.push(entry);
    writeLocalArticles(list);
    return entry;
  }

  static async updateArticle(id, payload) {
    const list = readLocalArticles();
    const idx = list.findIndex((item) => String(item.id) === String(id));
    if (idx === -1) {
      throw new Error('Article not found');
    }

    const current = list[idx];
    const title = payload.title !== undefined ? String(payload.title || '').trim() : current.title;
    if (!title) {
      throw new Error('Article title is required');
    }

    const updated = {
      ...current,
      title,
      excerpt: payload.excerpt !== undefined ? String(payload.excerpt || '').trim() : current.excerpt,
      author: payload.author !== undefined ? String(payload.author || '').trim() : current.author,
      date: payload.date !== undefined ? String(payload.date || '').trim() : current.date,
      link: payload.link !== undefined ? String(payload.link || '#').trim() || '#' : current.link,
      tags: payload.tags !== undefined ? normalizeTags(payload.tags) : current.tags,
      thumbnail: payload.thumbnail !== undefined ? String(payload.thumbnail || '').trim() : current.thumbnail,
      status: payload.status === 'draft' ? 'draft' : payload.status === 'published' ? 'published' : current.status,
      updated_at: new Date().toISOString(),
    };

    list[idx] = updated;
    writeLocalArticles(list);
    return updated;
  }

  static async deleteArticle(id) {
    const list = readLocalArticles();
    const idx = list.findIndex((item) => String(item.id) === String(id));
    if (idx === -1) {
      throw new Error('Article not found');
    }

    list.splice(idx, 1);
    writeLocalArticles(list);
    return { id, deleted: true };
  }
}
