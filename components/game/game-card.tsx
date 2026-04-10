import Link from "next/link";
import { Globe2, LockKeyhole, Play, Wand2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteGameButton } from "@/components/game/delete-game-button";
import { Panel } from "@/components/ui/panel";
import { formatRelativeDate, truncate } from "@/lib/utils";

type GameCardProps = {
  game: {
    id: string;
    slug: string;
    title: string;
    description: string;
    coverImage: string | null;
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
    <Panel className="group flex h-full flex-col gap-4 overflow-hidden p-5 transition hover:border-gray-300">
      {/* Cover Image */}
      {game.coverImage ? (
        <div className="-mx-5 -mt-5 mb-2 overflow-hidden rounded-t-2xl">
          <img
            src={game.coverImage}
            alt={game.title}
            className="h-32 w-full object-cover transition group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="-mx-5 -mt-5 mb-2 h-32 rounded-t-2xl bg-gradient-to-br from-gray-700 via-gray-600 to-gray-500">
          <div className="flex h-full items-center justify-center">
            <Wand2 className="size-10 text-white/40" />
          </div>
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Badge
            className={
              game.isPublic
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-gray-200 bg-gray-50 text-gray-600"
            }
          >
            {game.isPublic ? (
              <Globe2 className="size-3" />
            ) : (
              <LockKeyhole className="size-3" />
            )}
            {game.isPublic ? "Public" : "Private"}
          </Badge>
          <div>
            <h3 className="font-display text-base font-bold uppercase tracking-[0.06em] text-gray-900">
              {game.title}
            </h3>
            <p className="mt-1.5 text-sm leading-6 text-gray-500">
              {truncate(game.description, 120)}
            </p>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-2.5">
          <Wand2 className="size-4 text-gray-600" />
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-4 text-xs text-gray-400">
        <span>{formatRelativeDate(game.updatedAt)}</span>
        {creatorName ? <span>{creatorName}</span> : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {isPublicView ? (
          <Button asChild variant="primary" className="w-full">
            <Link href={`/play/${game.slug}`}>
              <Play className="size-3.5" />
              Play
            </Link>
          </Button>
        ) : (
          <>
            <Button asChild variant="primary" className="flex-1">
              <Link href={`/studio/${game.id}`}>Open</Link>
            </Button>
            {game.isPublic ? (
              <Button asChild variant="secondary" className="flex-1">
                <Link href={`/play/${game.slug}`}>View</Link>
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
