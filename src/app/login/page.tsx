import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LoginForm } from './LoginForm';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect('/characters');

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6 py-16">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-bold">Sign in to Grimoire</h1>
        <p className="text-text-muted">Build, save, and play your 3.5e characters.</p>
      </header>
      {searchParams.error && (
        <p role="alert" className="rounded-token border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
          {searchParams.error}
        </p>
      )}
      <LoginForm />
    </main>
  );
}
