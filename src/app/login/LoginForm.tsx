'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { signIn, signUp, devTestLogin, type AuthState } from '@/lib/supabase/auth-actions';

const ENABLE_TEST_LOGIN = process.env.NEXT_PUBLIC_ENABLE_TEST_LOGIN === 'true';

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-token bg-accent px-4 py-2 font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending ? '…' : label}
    </button>
  );
}

export function LoginForm() {
  const [signInState, signInAction] = useFormState<AuthState, FormData>(signIn, null);
  const [signUpState, signUpAction] = useFormState<AuthState, FormData>(signUp, null);
  const error = signInState?.error ?? signUpState?.error;

  return (
    <div className="flex flex-col gap-5">
      <form action={signInAction} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-text-muted">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="rounded-token border border-border bg-surface px-3 py-2 text-text-primary outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-text-muted">Password</span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            minLength={6}
            className="rounded-token border border-border bg-surface px-3 py-2 text-text-primary outline-none focus:border-accent"
          />
        </label>

        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}

        <div className="flex gap-2">
          <SubmitButton label="Sign in" />
          <button
            formAction={signUpAction}
            className="rounded-token border border-border px-4 py-2 font-medium transition-colors hover:bg-surface-raised"
          >
            Create account
          </button>
        </div>
      </form>

      {ENABLE_TEST_LOGIN && (
        <form action={devTestLogin} className="border-t border-border pt-4">
          <button
            type="submit"
            className="w-full rounded-token border border-dashed border-accent px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-surface-raised"
          >
            Continue as test user (dev)
          </button>
        </form>
      )}
    </div>
  );
}
