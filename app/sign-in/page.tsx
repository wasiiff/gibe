import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

import { GoogleSignInPanel } from "@/components/auth/google-sign-in-panel";

export default function SignInPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center px-6 py-16 lg:py-24">
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="size-4" />
        Back to home
      </Link>

      <div className="w-full space-y-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gray-900">
          <Sparkles className="size-7 text-white" />
        </div>
        <h1 className="font-display text-3xl font-bold uppercase tracking-[0.06em] text-gray-900">
          Sign In
        </h1>
        <p className="text-sm leading-7 text-gray-500">
          Sign in to create, save, and publish your games.
        </p>
      </div>

      <div className="mt-8 w-full">
        <GoogleSignInPanel />
      </div>
    </div>
  );
}
