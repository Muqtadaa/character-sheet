// One-time seed for the dev passwordless test login.
// Creates (and auto-confirms) the test account so `devTestLogin` can sign in.
//
// Usage (never run against production):
//   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
//   TEST_USER_EMAIL=test@local.dev TEST_USER_PASSWORD=... \
//   node scripts/seed-test-user.mjs
//
// The service role key is a SECRET — pass it via env, never commit it.
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.TEST_USER_EMAIL ?? 'test@local.dev';
const password = process.env.TEST_USER_PASSWORD;

if (!url || !serviceRole || !password) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or TEST_USER_PASSWORD.');
  process.exit(1);
}

const admin = createClient(url, serviceRole, { auth: { autoRefreshToken: false, persistSession: false } });

const { data, error } = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (error) {
  if (error.message?.toLowerCase().includes('already') || error.status === 422) {
    console.log(`Test user ${email} already exists — nothing to do.`);
    process.exit(0);
  }
  console.error('Failed to create test user:', error.message);
  process.exit(1);
}

console.log(`Created and confirmed test user ${email} (id ${data.user?.id}).`);
