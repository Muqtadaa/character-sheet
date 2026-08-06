import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { signOut } from '@/lib/supabase/auth-actions';

export default async function CharactersPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: characters } = await supabase
    .from('characters')
    .select('id, name, size')
    .order('updated_at', { ascending: false });

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-12">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Your Characters</h1>
          <p className="text-sm text-text-muted">{user.email}</p>
        </div>
        <form action={signOut}>
          <button className="rounded-token border border-border px-3 py-1.5 text-sm transition-colors hover:bg-surface-raised">
            Sign out
          </button>
        </form>
      </header>

      {characters && characters.length > 0 ? (
        <ul className="grid gap-3">
          {characters.map((c) => (
            <li
              key={c.id}
              className="rounded-token border border-border bg-surface-raised p-4"
            >
              <span className="font-display text-lg font-semibold">{c.name}</span>
              <span className="ml-2 text-sm capitalize text-text-muted">{c.size}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-token border border-dashed border-border p-8 text-center text-text-muted">
          No characters yet. The creation wizard is coming next.
        </div>
      )}
    </main>
  );
}
