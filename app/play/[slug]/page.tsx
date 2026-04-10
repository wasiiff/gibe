import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import {
  ArrowLeft,
  ArrowUpRight,
  Gamepad2,
  Sparkles,
  Trophy,
} from "lucide-react";

import { GamePreview } from "@/components/game-studio/game-preview";
import { RemixButton } from "@/components/game/remix-button";
import { ShareLinkButton } from "@/components/game/share-link-button";
import { ScoreSubmitButton } from "@/components/game/score-submit-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { buildPreviewDocument } from "@/lib/preview-document";
import {
  getPublicGameBySlug,
  getTopScores,
  incrementGamePlays,
} from "@/lib/games";
import { formatRelativeDate } from "@/lib/utils";
import { Scoreboard } from "@/components/game/scoreboard";

export default async function PlayGamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();

  const { slug } = await params;
  const game = await getPublicGameBySlug(slug);

  if (!game) {
    notFound();
  }

  // Increment play count
  await incrementGamePlays(game.id);

  // Fetch top scores
  const scores = await getTopScores(game.id, 10);

  const previewDocument = buildPreviewDocument({
    html: game.htmlCode,
    css: game.cssCode,
    js: game.jsCode,
  });
  const shareHref = `${process.env.BETTER_AUTH_URL ?? "http://localhost:3000"}/play/${game.slug}`;
  const creatorName = game.user?.name ?? "Anonymous Creator";
  const howToPlay = [
    "Use the preview above to play the game.",
    "Click 'Fullscreen' for distraction-free gameplay.",
    "Press ESC to exit fullscreen mode.",
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8 lg:px-8 lg:py-10">
      {/* Breadcrumb */}
      <Link
        href="/"
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="size-4" />
        Back to home
      </Link>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Game Preview */}
        <Panel className="overflow-hidden p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1.5">
              <Badge className="border-blue-200 bg-blue-50 text-blue-700">
                <Gamepad2 className="size-3" />
                Public Game
              </Badge>
              <h1 className="font-display text-3xl font-bold uppercase tracking-[0.06em] text-gray-900">
                {game.title}
              </h1>
              <p className="max-w-lg text-sm leading-6 text-gray-500">
                {game.description}
              </p>
            </div>
            <ShareLinkButton href={shareHref} />
          </div>
          <GamePreview
            srcDoc={previewDocument}
            title={`${game.title} public preview`}
            howToPlay={howToPlay}
          />
        </Panel>

        {/* Info Sidebar */}
        <div className="space-y-4">
          <Panel className="p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
              Creator
            </p>
            <h2 className="mt-2 font-display text-xl font-bold uppercase tracking-[0.06em] text-gray-900">
              {creatorName}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Updated {formatRelativeDate(game.updatedAt)}.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {game.totalPlays} {game.totalPlays === 1 ? "play" : "plays"}
            </p>
          </Panel>

          {/* Scoreboard */}
          <Panel className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
                Leaderboard
              </p>
              <Trophy className="size-4 text-amber-600" />
            </div>
            <Scoreboard scores={scores} className="mt-3" />
          </Panel>

          <Panel className="p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
              How to Play
            </p>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>• Use the preview above to play directly.</li>
              <li>• Click "Fullscreen" for the best experience.</li>
              <li>• Open the studio to create your own variation.</li>
            </ul>
          </Panel>

          <div className="space-y-3">
            <ScoreSubmitButton gameId={game.id} />
            <Button
              asChild
              variant="primary"
              className="w-full"
              leading={<Sparkles className="size-4" />}
            >
              <Link href="/studio/new">Create your own</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              className="w-full"
              leading={<ArrowUpRight className="size-4" />}
            >
              <Link href="/dashboard">Open dashboard</Link>
            </Button>
            <RemixButton gameId={game.slug} className="w-full" />
          </div>
        </div>
      </section>
    </div>
  );
}
