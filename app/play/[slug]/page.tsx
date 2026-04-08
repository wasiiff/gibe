import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowUpRight, Gamepad2, Sparkles } from "lucide-react";

import { GamePreview } from "@/components/game-studio/game-preview";
import { RemixButton } from "@/components/game/remix-button";
import { ShareLinkButton } from "@/components/game/share-link-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { buildPreviewDocument } from "@/lib/preview-document";
import { getPublicGameBySlug } from "@/lib/games";
import { formatRelativeDate } from "@/lib/utils";

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

  const previewDocument = buildPreviewDocument({
    html: game.htmlCode,
    css: game.cssCode,
    js: game.jsCode,
  });
  const shareHref = `${process.env.BETTER_AUTH_URL ?? "http://localhost:3000"}/play/${game.slug}`;
  const creatorName = game.user?.name ?? "Anonymous Creator";

  // Extract howToPlay from the game - we'll store it in description for now
  // In a real app, you'd have a separate howToPlay field
  const howToPlay = [
    "Use the preview above to play the live build directly.",
    "Click 'Fullscreen' button for distraction-free gameplay.",
    "Press ESC to exit fullscreen mode.",
  ];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-8 lg:py-12">
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel className="overflow-hidden p-5">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
              <Badge className="text-cyan-200">
                <Gamepad2 className="size-3.5" />
                Public arcade build
              </Badge>
              <h1 className="font-display text-4xl uppercase tracking-[0.08em] text-white">
                {game.title}
              </h1>
              <p className="max-w-3xl text-sm leading-7 text-slate-300">
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

        <div className="space-y-6">
          <Panel className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Creator
            </p>
            <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.08em] text-white">
              {creatorName}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Updated {formatRelativeDate(game.updatedAt)}. This page runs the
              published HTML, CSS, and JavaScript inside an isolated sandboxed
              frame.
            </p>
          </Panel>
          <Panel className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Play notes
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
              <li>• Use the preview above to play the live build directly.</li>
              <li>
                • Open the studio to create your own prompt-driven variation.
              </li>
              <li>
                • Published updates replace this build without changing the
                link.
              </li>
            </ul>
          </Panel>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              variant="primary"
              leading={<Sparkles className="size-4" />}
            >
              <Link href="/studio/new">Forge your own game</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              leading={<ArrowUpRight className="size-4" />}
            >
              <Link href="/dashboard">Open dashboard</Link>
            </Button>
            <RemixButton gameId={game.slug} />
          </div>
        </div>
      </section>
    </div>
  );
}
