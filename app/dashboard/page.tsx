import Link from "next/link";
import { connection } from "next/server";
import { Globe2, LockKeyhole, Plus, Sparkles } from "lucide-react";

import { GameCardList } from "@/components/game/game-card-list";
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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 lg:px-8 lg:py-12">
      {/* Profile & Stats */}
      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel className="p-6">
          <Badge className="border-blue-200 bg-blue-50 text-blue-700">
            <Sparkles className="size-3" />
            Creator
          </Badge>
          <h1 className="mt-4 font-display text-3xl font-bold uppercase tracking-[0.06em] text-gray-900">
            {session.user.name}
          </h1>
          <p className="mt-2 text-sm text-gray-500">{session.user.email}</p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <Panel className="p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
                Total
              </p>
              <p className="mt-2 font-display text-2xl font-bold text-gray-900">
                {games.length}
              </p>
            </Panel>
            <Panel className="p-4">
              <p className="flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-gray-400">
                <Globe2 className="size-3 text-blue-600" />
                Public
              </p>
              <p className="mt-2 font-display text-2xl font-bold text-gray-900">
                {publicCount}
              </p>
            </Panel>
            <Panel className="p-4">
              <p className="flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-gray-400">
                <LockKeyhole className="size-3 text-gray-500" />
                Private
              </p>
              <p className="mt-2 font-display text-2xl font-bold text-gray-900">
                {privateCount}
              </p>
            </Panel>
          </div>
        </Panel>

        <Panel className="flex flex-col justify-between p-6">
          <div className="space-y-3">
            <Badge>Studio</Badge>
            <h2 className="font-display text-2xl font-bold uppercase tracking-[0.06em] text-gray-900">
              Start a new game
            </h2>
            <p className="max-w-md text-sm leading-6 text-gray-500">
              Create a game from scratch, use a template, or iterate on an
              existing project.
            </p>
          </div>
          <div className="mt-5">
            <Button
              asChild
              variant="primary"
              size="lg"
              leading={<Plus className="size-4" />}
            >
              <Link href="/studio/new">Create game</Link>
            </Button>
          </div>
        </Panel>
      </section>

      {/* Games List */}
      <section className="space-y-6">
        <SectionHeading
          eyebrow="Your Games"
          title="Saved Builds"
          description="Reopen any game to edit, refine, or publish updates."
        />
        {games.length ? (
          <GameCardList games={games} />
        ) : (
          <Panel className="p-10 text-center">
            <Sparkles className="mx-auto size-10 text-gray-300" />
            <p className="mt-3 text-sm leading-7 text-gray-500">
              No games yet. Create your first one to get started.
            </p>
            <Button
              asChild
              variant="primary"
              className="mt-5"
              leading={<Plus className="size-4" />}
            >
              <Link href="/studio/new">Create game</Link>
            </Button>
          </Panel>
        )}
      </section>
    </div>
  );
}
