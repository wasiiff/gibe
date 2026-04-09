"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
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

export function GoogleSignInPanel() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID !== undefined;

  return (
    <div className="space-y-4">
      <Button
        className="w-full"
        size="lg"
        variant="secondary"
        leading={
          pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <GoogleGlyph />
          )
        }
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
      </Button>
      {!googleEnabled && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-600" />
          <p>
            Google auth is disabled until environment variables are configured.
          </p>
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
