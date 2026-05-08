import bcrypt from 'bcryptjs';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

(async () => {
  try {
    await client.connect();
    const pw = 'Admin@12345';
    const hash = await bcrypt.hash(pw, 10);
    console.log('bcrypt hash:', hash);
    const res = await client.query('update public.admin_users set password_hash=$1 where username=$2 returning id', [hash, 'admin']);
    console.log('updated rows:', res.rows);
  } catch (err) {
    console.error('error', err);
    process.exit(1);
  } finally {
    await client.end();
  }
})();
