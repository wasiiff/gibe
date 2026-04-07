import Link from "next/link";
import { connection } from "next/server";
import { Globe2, LockKeyhole, Plus, Sparkles } from "lucide-react";

import { GameCard } from "@/components/game/game-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { SectionHeading } from "@/components/ui/section-heading";
import { listGamesForUser } from "@/lib/games";
import { requireSession } from "@/lib/session";

export default async function DashboardPage() {
  await connection();

  const session = await requireSession();
  const games = await listGamesForUser(session.user.id);
  const publicCount = games.filter((game) => game.isPublic).length;
  const privateCount = games.length - publicCount;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-12 lg:px-8 lg:py-14">
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel className="p-6">
          <Badge className="text-cyan-200">
            <Sparkles className="size-3.5" />
            Creator profile
          </Badge>
          <h1 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white">
            {session.user.name}
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">{session.user.email}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Panel className="p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Total builds</p>
              <p className="mt-3 font-display text-3xl text-white">{games.length}</p>
            </Panel>
            <Panel className="p-4">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                <Globe2 className="size-3.5 text-cyan-200" />
                Public
              </p>
              <p className="mt-3 font-display text-3xl text-white">{publicCount}</p>
            </Panel>
            <Panel className="p-4">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                <LockKeyhole className="size-3.5 text-slate-200" />
                Private
              </p>
              <p className="mt-3 font-display text-3xl text-white">{privateCount}</p>
            </Panel>
          </div>
        </Panel>

        <Panel className="flex flex-col justify-between p-6">
          <div className="space-y-4">
            <Badge className="text-slate-200">Studio control room</Badge>
            <h2 className="font-display text-3xl uppercase tracking-[0.08em] text-white">
              Open a new build lane
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-slate-300">
              Start from a blank prompt, regenerate code, inspect the sandboxed
              preview, then push the result back here as a private draft or a public
              arcade release.
            </p>
          </div>
          <div className="mt-6">
            <Button asChild variant="primary" size="lg" leading={<Plus className="size-4" />}>
              <Link href="/studio/new">Create new game</Link>
            </Button>
          </div>
        </Panel>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Your Games"
          title="Saved Builds"
          description="Every draft stays tied to your profile. Reopen a studio session, edit the code manually, and publish updates when the preview is stable."
        />
        {games.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <Panel className="p-8 text-sm leading-7 text-slate-300">
            No saved builds yet. Open the studio, generate your first prompt-driven
            game, then save it here.
          </Panel>
        )}
      </section>
    </div>
  );
}

