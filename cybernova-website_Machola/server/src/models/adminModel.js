import bcrypt from 'bcryptjs';
import { supabase, hasSupabaseConfig } from '../config/supabase.js';

const ADMIN_TABLE = 'admin_users';

async function seedDefaultAdminIfNeeded() {
  if (!hasSupabaseConfig || !supabase) {
    return;
  }

  const fallbackUsername = process.env.ADMIN_USERNAME;
  const fallbackPassword = process.env.ADMIN_PASSWORD;

  if (!fallbackUsername || !fallbackPassword) {
    return;
  }

  const { data, error } = await supabase
    .from(ADMIN_TABLE)
    .select('id')
    .limit(1);

  if (error) {
    return;
  }

  if (Array.isArray(data) && data.length > 0) {
    return;
  }

  const passwordHash = await bcrypt.hash(fallbackPassword, 10);
  const seedPayload = {
    username: fallbackUsername,
    email: fallbackUsername.includes('@') ? fallbackUsername : null,
    password_hash: passwordHash,
    role: 'admin',
    is_active: true,
  };

  await supabase.from(ADMIN_TABLE).insert([seedPayload]);
}

export class AdminModel {
  static async authenticateAdmin(loginName, password) {
    if (!hasSupabaseConfig || !supabase) {
      throw new Error('Supabase admin database is not configured.');
    }

    await seedDefaultAdminIfNeeded();

    const { data: usernameMatch, error: usernameError } = await supabase
      .from(ADMIN_TABLE)
      .select('id, username, email, password_hash, role, is_active')
      .eq('username', loginName)
      .maybeSingle();

    if (usernameError) {
      throw new Error(usernameError.message);
    }

    const candidate = usernameMatch || await (async () => {
      const { data, error } = await supabase
        .from(ADMIN_TABLE)
        .select('id, username, email, password_hash, role, is_active')
        .eq('email', loginName)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    })();

    if (!candidate || candidate.is_active === false) {
      return null;
    }

    const passwordMatches = await bcrypt.compare(password, candidate.password_hash || '');
    if (!passwordMatches) {
      return null;
    }

    return candidate;
  }
}