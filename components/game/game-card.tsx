import Link from "next/link";
import { Globe2, LockKeyhole, Play, Wand2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { DeleteGameButton } from "@/components/game/delete-game-button";
import { formatRelativeDate, truncate } from "@/lib/utils";

type GameCardProps = {
  game: {
    id: string;
    slug: string;
    title: string;
    description: string;
    isPublic: boolean;
    updatedAt: Date | string;
  };
  creatorName?: string;
  mode?: "dashboard" | "public";
  onDelete?: () => void;
};

export function GameCard({
  game,
  creatorName,
  mode = "dashboard",
  onDelete,
}: GameCardProps) {
  const isPublicView = mode === "public";

  return (
    <Panel className="group flex h-full flex-col gap-5 overflow-hidden p-5 transition duration-200 hover:-translate-y-1 hover:border-cyan-300/20">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <Badge className={game.isPublic ? "text-cyan-200" : "text-slate-300"}>
            {game.isPublic ? (
              <Globe2 className="size-3.5" />
            ) : (
              <LockKeyhole className="size-3.5" />
            )}
            {game.isPublic ? "Public" : "Private"}
          </Badge>
          <div>
            <h3 className="font-display text-xl uppercase tracking-[0.08em] text-white">
              {game.title}
            </h3>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              {truncate(game.description, 140)}
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/6 p-3">
          <Wand2 className="size-5 text-cyan-200" />
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-4 text-xs uppercase tracking-[0.16em] text-slate-400">
        <span>{formatRelativeDate(game.updatedAt)}</span>
        {creatorName ? <span>{creatorName}</span> : null}
      </div>

      <div className="flex flex-wrap gap-3">
        {isPublicView ? (
          <Button asChild variant="primary" className="w-full">
            <Link href={`/play/${game.slug}`}>
              <Play className="size-4" />
              Play now
            </Link>
          </Button>
        ) : (
          <>
            <Button asChild variant="primary" className="flex-1">
              <Link href={`/studio/${game.id}`}>Open studio</Link>
            </Button>
            {game.isPublic ? (
              <Button asChild variant="secondary" className="flex-1">
                <Link href={`/play/${game.slug}`}>Open live</Link>
              </Button>
            ) : null}
            {onDelete && (
              <DeleteGameButton gameId={game.id} onSuccess={onDelete} />
            )}
          </>
        )}
      </div>
    </Panel>
  );
}
