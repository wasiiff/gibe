import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Shield, Wand2 } from "lucide-react";

import { GoogleSignInPanel } from "@/components/auth/google-sign-in-panel";
import { PipelineGraphic } from "@/components/brand/pipeline-graphic";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { hasGoogleAuthConfig } from "@/lib/env";
import { getSession } from "@/lib/session";

export default async function SignInPage() {
  await connection();

  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1fr_0.95fr] lg:px-8 lg:py-16">
      <div className="space-y-6">
        <Badge className="text-cyan-200">
          <Shield className="size-3.5" />
          Better Auth + Google
        </Badge>
        <div className="space-y-4">
          <h1 className="font-display text-5xl uppercase leading-none tracking-[0.08em] text-white md:text-6xl">
            Authenticate once.
            <br />
            Build forever.
          </h1>
          <p className="max-w-xl text-base leading-8 text-slate-300">
            Private drafts, public publishing, and creator dashboards all route
            through the same Better Auth session layer.
          </p>
        </div>
        <Panel className="overflow-hidden p-5">
          <PipelineGraphic className="w-full" />
        </Panel>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            "Google sign-in via Better Auth route handlers",
            "Session-backed dashboard and owned game access",
            "Server-side auth checks on protected data mutations",
            "Public play pages isolated from the editor workspace",
          ].map((item) => (
            <Panel key={item} className="flex items-center gap-3 p-4 text-sm text-slate-300">
              <Wand2 className="size-4 text-cyan-200" />
              {item}
            </Panel>
          ))}
        </div>
      </div>
      <div className="lg:pt-16">
        <GoogleSignInPanel googleEnabled={hasGoogleAuthConfig()} />
      </div>
    </div>
  );
}

