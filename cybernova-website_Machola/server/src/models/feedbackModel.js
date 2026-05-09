import fs from 'fs';
import path from 'path';
import { supabase, hasSupabaseConfig } from '../config/supabase.js';

const DATA_DIR = path.join(process.cwd(), 'server', 'data');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedback.json');

function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(FEEDBACK_FILE)) fs.writeFileSync(FEEDBACK_FILE, '[]', 'utf8');
  } catch (err) {
    // ignore file system errors here; higher layers will handle failures
  }
}

function readLocalFeedback() {
  ensureDataFile();
  const raw = fs.readFileSync(FEEDBACK_FILE, 'utf8');
  try {
    return JSON.parse(raw || '[]');
  } catch (err) {
    return [];
  }
}

function writeLocalFeedback(arr) {
  ensureDataFile();
  fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(arr, null, 2), 'utf8');
}

export class FeedbackModel {
  static async createFeedback(payload) {
    // ensure defaults
    const row = {
      status: payload.status || 'pending',
      created_at: payload.created_at || new Date().toISOString(),
      ...payload,
    };

    if (hasSupabaseConfig && supabase) {
      const { data, error } = await supabase
        .from('feedback')
        .insert([row])
        .select('*')
        .single();

      if (error) throw new Error(error.message);
      return data;
    }

    // Fallback to local file storage
    const list = readLocalFeedback();
    const id = Date.now();
    const entry = {
      id,
      status: 'pending',
      created_at: new Date().toISOString(),
      ...payload,
    };
    list.push(entry);
    writeLocalFeedback(list);
    return entry;
  }

  static async getFeedbackBySourceInquiryId(sourceInquiryId) {
    if (!sourceInquiryId) return null;

    if (hasSupabaseConfig && supabase) {
      try {
        const { data, error } = await supabase
          .from('feedback')
          .select('*')
          .eq('source_inquiry_id', sourceInquiryId)
          .limit(1);

        if (error) throw new Error(error.message);
        return data?.[0] || null;
      } catch (err) {
        if (/source_inquiry_id|schema cache|column/i.test(err.message || '')) {
          return null;
        }
        throw err;
      }
    }

    const list = readLocalFeedback();
    return list.find((feedback) => String(feedback.source_inquiry_id) === String(sourceInquiryId)) || null;
  }

  static async createFeedbackFromInquiry(inquiry) {
    const existing = await this.getFeedbackBySourceInquiryId(inquiry.id);
    const payload = {
      name: (inquiry.name || '').trim(),
      email: (inquiry.email || '').trim(),
      rating: inquiry.rating == null || inquiry.rating === '' ? 5 : Number(inquiry.rating),
      comment: (inquiry.description || '').trim(),
      company: inquiry.organization ? inquiry.organization.trim() : null,
      role: inquiry.job_title ? inquiry.job_title.trim() : null,
      // do not auto-approve feedback created from inquiries; admin should approve
      status: 'pending',
      source_inquiry_id: inquiry.id,
    };

    if (existing) {
      return this.updateFeedback(existing.id, payload);
    }

    try {
      return await this.createFeedback(payload);
    } catch (err) {
      if (hasSupabaseConfig && supabase && /source_inquiry_id|schema cache|column/i.test(err.message || '')) {
        const { source_inquiry_id, ...fallbackPayload } = payload;
        return this.createFeedback(fallbackPayload);
      }
      throw err;
    }
  }

  static async getAllFeedback(approvedOnly = false) {
    if (hasSupabaseConfig && supabase) {
      let query = supabase.from('feedback').select('*');
      if (approvedOnly) {
        query = query.eq('status', 'approved');
      }
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    }

    const list = readLocalFeedback();
    const filtered = approvedOnly ? list.filter(f => f.status === 'approved') : list;
    return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  static async getFeedbackById(id) {
    if (hasSupabaseConfig && supabase) {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw new Error(error.message);
      return data;
    }

    const list = readLocalFeedback();
    return list.find(f => String(f.id) === String(id)) || null;
  }

  static async updateFeedback(id, updates) {
    if (hasSupabaseConfig && supabase) {
      const { data, error } = await supabase
        .from('feedback')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw new Error(error.message);
      return data;
    }

    const list = readLocalFeedback();
    const idx = list.findIndex(f => String(f.id) === String(id));
    if (idx === -1) throw new Error('Feedback not found');
    list[idx] = { ...list[idx], ...updates };
    writeLocalFeedback(list);
    return list[idx];
  }

  static async deleteFeedback(id) {
    if (hasSupabaseConfig && supabase) {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
      return { success: true };
    }

    const list = readLocalFeedback();
    const filtered = list.filter(f => String(f.id) !== String(id));
    writeLocalFeedback(filtered);
    return { success: true };
  }
}
