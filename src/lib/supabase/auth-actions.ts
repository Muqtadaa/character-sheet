'use server';

import { redirect } from 'next/navigation';
import { createClient } from './server';

export type AuthState = { error?: string } | null;

/** Sign in with email + password (useFormState-compatible). */
export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  redirect('/characters');
}

/** Register a new account (useFormState-compatible). */
export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const supabase = createClient();
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) return { error: error.message };
  redirect('/characters');
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

/**
 * Dev-only passwordless test login. Signs in a fixed seeded account using
 * server-side credentials so the tester never types a password. HARD-GATED:
 * returns an error unless NEXT_PUBLIC_ENABLE_TEST_LOGIN is enabled, so it can
 * never be used in production. Seed the account once with scripts/seed-test-user.mjs.
 */
export async function devTestLogin(): Promise<void> {
  const fail = (msg: string) => redirect(`/login?error=${encodeURIComponent(msg)}`);

  if (process.env.NEXT_PUBLIC_ENABLE_TEST_LOGIN !== 'true') fail('Test login is disabled.');
  const email = process.env.TEST_USER_EMAIL ?? 'test@local.dev';
  const password = process.env.TEST_USER_PASSWORD ?? '';
  if (!password) fail('TEST_USER_PASSWORD is not set — run scripts/seed-test-user.mjs first.');

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) fail(error.message);
  redirect('/characters');
}
