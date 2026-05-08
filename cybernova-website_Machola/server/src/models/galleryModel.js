import fs from 'fs';
import path from 'path';
import { supabase, hasSupabaseConfig } from '../config/supabase.js';

const DATA_DIR = path.join(process.cwd(), 'server', 'data');
const GALLERY_FILE = path.join(DATA_DIR, 'gallery.json');

function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(GALLERY_FILE)) {
      const defaultItems = [
        {
          id: 'gallery-1',
          image_url: '/images/gallery1.jpg',
          title: 'Security Operations',
          description: 'Team working on security monitoring',
          category: 'workshop',
          created_at: new Date().toISOString(),
        },
        {
          id: 'gallery-2',
          image_url: '/images/gallery2.jpg',
          title: 'Incident Response',
          description: 'Training workshop session',
          category: 'training',
          created_at: new Date().toISOString(),
        },
      ];
      fs.writeFileSync(GALLERY_FILE, JSON.stringify(defaultItems, null, 2), 'utf8');
    }
  } catch (err) {
    // ignore file system errors here
  }
}

function readLocalGallery() {
  ensureDataFile();
  const raw = fs.readFileSync(GALLERY_FILE, 'utf8');
  try {
    return JSON.parse(raw || '[]');
  } catch (err) {
    return [];
  }
}

function writeLocalGallery(arr) {
  ensureDataFile();
  fs.writeFileSync(GALLERY_FILE, JSON.stringify(arr, null, 2), 'utf8');
}

export class GalleryModel {
  static async createGalleryItem(payload) {
    if (hasSupabaseConfig && supabase) {
      try {
        const { data, error } = await supabase
          .from('gallery_items')
          .insert([payload])
          .select('*')
          .single();

        if (!error && data) return data;
      } catch {
        // fall back to local storage below
      }
    }

    const list = readLocalGallery();
    const id = `gallery-${Date.now()}`;
    const entry = {
      id,
      created_at: new Date().toISOString(),
      ...payload,
    };
    list.push(entry);
    writeLocalGallery(list);
    return entry;
  }

  static async getAllGalleryItems() {
    if (hasSupabaseConfig && supabase) {
      try {
        const { data, error } = await supabase
          .from('gallery_items')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) return data;
      } catch {
        // fall back to local storage below
      }
    }

    const list = readLocalGallery();
    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  static async getGalleryItemById(id) {
    if (hasSupabaseConfig && supabase) {
      try {
        const { data, error } = await supabase
          .from('gallery_items')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) return data;
      } catch {
        // fall back to local storage below
      }
    }

    const list = readLocalGallery();
    return list.find(item => String(item.id) === String(id)) || null;
  }

  static async updateGalleryItem(id, updates) {
    if (hasSupabaseConfig && supabase) {
      try {
        const { data, error } = await supabase
          .from('gallery_items')
          .update(updates)
          .eq('id', id)
          .select('*')
          .single();

        if (!error && data) return data;
      } catch {
        // fall back to local storage below
      }
    }

    const list = readLocalGallery();
    const idx = list.findIndex(item => String(item.id) === String(id));
    if (idx === -1) throw new Error('Gallery item not found');
    list[idx] = { ...list[idx], ...updates };
    writeLocalGallery(list);
    return list[idx];
  }

  static async deleteGalleryItem(id) {
    if (hasSupabaseConfig && supabase) {
      try {
        const { error } = await supabase
          .from('gallery_items')
          .delete()
          .eq('id', id);

        if (!error) return { success: true };
      } catch {
        // fall back to local storage below
      }
    }

    const list = readLocalGallery();
    const filtered = list.filter(item => String(item.id) !== String(id));
    writeLocalGallery(filtered);
    return { success: true };
  }
}
