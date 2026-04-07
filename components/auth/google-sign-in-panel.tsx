"use client";

import { AlertCircle, ArrowRight, LoaderCircle } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { authClient } from "@/lib/auth-client";

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        d="M21.8 12.23c0-.76-.07-1.48-.2-2.18H12v4.13h5.49a4.7 4.7 0 0 1-2.04 3.09v2.57h3.3c1.94-1.78 3.05-4.4 3.05-7.61Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.76 0 5.07-.91 6.76-2.48l-3.3-2.57c-.91.61-2.08.98-3.46.98-2.66 0-4.91-1.79-5.71-4.2H2.9v2.66A10 10 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.29 13.73a5.95 5.95 0 0 1 0-3.46V7.61H2.9a10 10 0 0 0 0 8.78l3.39-2.66Z"
        fill="#FBBC04"
      />
      <path
        d="M12 6.07c1.5 0 2.84.51 3.9 1.52l2.92-2.92C17.06 2.99 14.75 2 12 2A10 10 0 0 0 2.9 7.61l3.39 2.66c.8-2.41 3.05-4.2 5.71-4.2Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function GoogleSignInPanel({ googleEnabled }: { googleEnabled: boolean }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <Panel className="max-w-xl p-8">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">
          Authenticate
        </p>
        <h1 className="font-display text-4xl uppercase tracking-[0.08em] text-white">
          Enter the Game Forge
        </h1>
        <p className="text-sm leading-7 text-slate-300">
          Sign in with Google to save private builds, reopen your editor sessions,
          and publish live game links from the dashboard.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        <Button
          className="w-full"
          size="lg"
          variant="primary"
          leading={pending ? <LoaderCircle className="size-4 animate-spin" /> : <GoogleGlyph />}
          disabled={!googleEnabled || pending}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              try {
                await authClient.signIn.social({
                  provider: "google",
                  callbackURL: "/dashboard",
                });
              } catch (nextError) {
                setError(
                  nextError instanceof Error
                    ? nextError.message
                    : "Unable to start Google sign-in.",
                );
              }
            });
          }}
        >
          Continue with Google
          <ArrowRight className="size-4" />
        </Button>
        {!googleEnabled ? (
          <div className="flex items-start gap-3 rounded-3xl border border-amber-300/20 bg-amber-400/8 p-4 text-sm text-amber-100">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            Google auth is disabled until `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`,
            `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL` are configured.
          </div>
        ) : null}
        {error ? (
          <div className="rounded-3xl border border-rose-300/20 bg-rose-500/10 p-4 text-sm text-rose-100">
            {error}
          </div>
        ) : null}
      </div>
    </Panel>
  );
}

