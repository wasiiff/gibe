import Link from "next/link";
import { connection } from "next/server";
import { Gamepad2, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GameCardPublic } from "@/components/game/game-card-public";
import { Panel } from "@/components/ui/panel";
import { listAllPublicGames } from "@/lib/games";
import { getSession } from "@/lib/session";

export default async function GamesPage() {
  await connection();

  const [session, games] = await Promise.all([
    getSession(),
    listAllPublicGames(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-12 lg:px-8">
      {/* Header */}
      <div className="mb-10 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3">
            <Badge className="border-blue-200 bg-blue-50 text-blue-700">
              <Gamepad2 className="size-3" />
              Community Arcade
            </Badge>
            <h1 className="font-display text-4xl font-bold uppercase tracking-[0.06em] text-gray-900">
              Published Games
            </h1>
            <p className="max-w-2xl text-base leading-7 text-gray-500">
              Explore games created by the community. Play them, check the
              leaderboards, download assets, or remix them to add your own
              improvements.
            </p>
          </div>
          <div className="flex gap-3">
            {session ? (
              <Button
                asChild
                variant="primary"
                leading={<Sparkles className="size-4" />}
              >
                <Link href="/studio/new">Create Your Game</Link>
              </Button>
            ) : (
              <Button asChild variant="primary">
                <Link href="/sign-in">Sign In to Create</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 border-t border-gray-200 pt-6 text-sm">
          <div>
            <p className="font-display text-2xl font-bold text-gray-900">
              {games.length}
            </p>
            <p className="text-gray-500">Published Games</p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-gray-900">
              {games.reduce((sum, g) => sum + g.totalPlays, 0).toLocaleString()}
            </p>
            <p className="text-gray-500">Total Plays</p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-gray-900">
              {new Set(games.map((g) => g.user.id)).size}
            </p>
            <p className="text-gray-500">Creators</p>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      {games.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <GameCardPublic
              key={game.id}
              game={{
                id: game.id,
                slug: game.slug,
                title: game.title,
                description: game.description,
                coverImage: game.coverImage,
                isPublic: game.isPublic,
                publishedAt: game.publishedAt,
                totalPlays: game.totalPlays,
                user: game.user,
              }}
            />
          ))}
        </div>
      ) : (
        <Panel className="p-12 text-center">
          <Gamepad2 className="mx-auto size-12 text-gray-300" />
          <h2 className="mt-4 font-display text-xl font-bold uppercase tracking-[0.06em] text-gray-900">
            No Games Yet
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base leading-7 text-gray-500">
            Be the first to create and publish a game! Use our AI-powered studio
            to build your game from a simple description.
          </p>
          <Button
            asChild
            variant="primary"
            className="mt-6"
            leading={<Sparkles className="size-4" />}
          >
            <Link href={session ? "/studio/new" : "/sign-in"}>
              {session ? "Create Your Game" : "Sign In to Start"}
            </Link>
          </Button>
        </Panel>
      )}
    </div>
  );
}
