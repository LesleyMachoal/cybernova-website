import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabase, hasSupabaseConfig } from '../config/supabase.js';

export const ALLOWED_INQUIRY_STATUSES = ['new', 'resolved'];

const DATA_DIR = path.join(process.cwd(), 'server', 'data');
const INQUIRY_FILE = path.join(DATA_DIR, 'inquiries.json');

function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(INQUIRY_FILE)) fs.writeFileSync(INQUIRY_FILE, '[]', 'utf8');
  } catch (err) {
    // ignore file system errors here; higher layers will handle failures
  }
}

function readLocalInquiries() {
  ensureDataFile();
  const raw = fs.readFileSync(INQUIRY_FILE, 'utf8');
  try {
    return JSON.parse(raw || '[]');
  } catch (err) {
    return [];
  }
}

function writeLocalInquiries(arr) {
  ensureDataFile();
  fs.writeFileSync(INQUIRY_FILE, JSON.stringify(arr, null, 2), 'utf8');
}

export class InquiryModel {
  static async createInquiry(payload) {
    if (hasSupabaseConfig && supabase) {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .insert([payload])
        .select('*')
        .single();

      if (error) throw new Error(error.message);
      return data;
    }

    // Fallback to local file storage for development/testing
    const list = readLocalInquiries();
    const id = Date.now();
    const entry = { id, status: 'new', submitted_at: new Date().toISOString(), ...payload };
    list.push(entry);
    writeLocalInquiries(list);
    return entry;
  }

  static async getAllInquiries() {
    if (hasSupabaseConfig && supabase) {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    }

    const list = readLocalInquiries();
    return list.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
  }

  static async updateStatus(id, status) {
    if (!ALLOWED_INQUIRY_STATUSES.includes(status)) {
      throw new Error(`Invalid status. Allowed statuses: ${ALLOWED_INQUIRY_STATUSES.join(', ')}`);
    }

    if (hasSupabaseConfig && supabase) {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .update({ status })
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw new Error(error.message);
      return data;
    }

    const list = readLocalInquiries();
    const idx = list.findIndex(item => String(item.id) === String(id));
    if (idx === -1) throw new Error('Inquiry not found');
    list[idx].status = status;
    writeLocalInquiries(list);
    return list[idx];
  }

  static async deleteInquiry(id) {
    if (hasSupabaseConfig && supabase) {
      const { error } = await supabase
        .from('contact_inquiries')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
      return { id, deleted: true };
    }

    const list = readLocalInquiries();
    const idx = list.findIndex(item => String(item.id) === String(id));
    if (idx === -1) throw new Error('Inquiry not found');
    list.splice(idx, 1);
    writeLocalInquiries(list);
    return { id, deleted: true };
  }
}
