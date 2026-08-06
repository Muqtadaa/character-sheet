import Link from 'next/link';

const features = [
  {
    title: 'A real 3.5e rules engine',
    body: 'Bonus-type stacking, multiclassing, level adjustment, skill-point budgets, feat prerequisites, and spell slots — the sheet is derived, not just stored. Every number shows its breakdown.',
  },
  {
    title: 'Homebrew, built once & shared',
    body: 'Guided builders for custom races, classes, prestige classes, feats, items, and spells. Export a pack, and every player at the table imports the same content.',
  },
  {
    title: 'Live at the table',
    body: 'Take damage, get healed, apply buffs and debuffs, add loot on the fly, roll any modifier with one click, and keep session notes — all reversible and logged.',
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-12 px-6 py-20">
      <header className="flex flex-col gap-4">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          Dungeons &amp; Dragons 3.5e
        </p>
        <h1 className="font-display text-5xl font-bold leading-tight">
          Grimoire
        </h1>
        <p className="max-w-prose text-lg text-text-muted">
          A character sheet builder that actually knows the rules — build,
          save, and play your 3.5e characters, homebrew and all.
        </p>
        <div className="mt-2 flex gap-3">
          <Link
            href="/characters"
            className="rounded-token bg-accent px-5 py-2.5 font-medium text-accent-fg transition-opacity hover:opacity-90"
          >
            My Characters
          </Link>
          <Link
            href="/builder"
            className="rounded-token border border-border px-5 py-2.5 font-medium text-text-primary transition-colors hover:bg-surface-raised"
          >
            Homebrew Builder
          </Link>
        </div>
      </header>

      <section className="grid gap-4">
        {features.map((f) => (
          <article
            key={f.title}
            className="rounded-token border border-border bg-surface-raised p-5"
          >
            <h2 className="font-display text-xl font-semibold">{f.title}</h2>
            <p className="mt-1.5 text-text-muted">{f.body}</p>
          </article>
        ))}
      </section>

      <footer className="text-sm text-text-muted">
        Built for a private table. Full 3.5e reference content plus your own
        homebrew.
      </footer>
    </main>
  );
}
