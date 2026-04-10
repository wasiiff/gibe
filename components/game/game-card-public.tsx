"use client";

import { Download, GitFork, Loader2, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { formatRelativeDate, truncate } from "@/lib/utils";

type HighScore = {
  id: string;
  playerName: string;
  score: number;
  createdAt: string;
};

type GameCardPublicProps = {
  game: {
    id: string;
    slug: string;
    title: string;
    description: string;
    coverImage: string | null;
    isPublic: boolean;
    publishedAt: Date | string | null;
    totalPlays: number;
    user: {
      id: string;
      name: string;
      image: string | null;
    };
  };
};

export function GameCardPublic({ game }: GameCardPublicProps) {
  const [isRemixing, startRemixTransition] = useTransition();
  const [remixError, setRemixError] = useState<string | null>(null);
  const [showScores, setShowScores] = useState(false);
  const [topScores, setTopScores] = useState<HighScore[]>([]);
  const [loadingScores, setLoadingScores] = useState(false);

  useEffect(() => {
    if (showScores && topScores.length === 0) {
      setLoadingScores(true);
      fetch(`/api/games/${game.id}/scores?limit=3`)
        .then((res) => res.json())
        .then((data) => {
          setTopScores(data.scores ?? []);
          setLoadingScores(false);
        })
        .catch(() => {
          setLoadingScores(false);
        });
    }
  }, [showScores, game.id, topScores.length]);

  async function handleRemix() {
    setRemixError(null);
    startRemixTransition(async () => {
      try {
        const response = await fetch("/api/games/remix", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameId: game.slug }),
        });

        if (!response.ok) {
          const data = (await response.json()) as { error?: string };
          throw new Error(data.error ?? "Failed to remix game");
        }

        const payload = (await response.json()) as {
          game: { id: string; slug: string };
        };
        window.location.href = `/studio/${payload.game.id}`;
      } catch (err) {
        setRemixError(
          err instanceof Error ? err.message : "Failed to remix game",
        );
      }
    });
  }

  function handleDownloadAssets() {
    window.location.href = `/api/games/${game.id}/download-assets`;
  }

  return (
    <Panel className="group flex h-full flex-col gap-5 overflow-hidden p-5 transition hover:border-gray-300">
      {/* Cover Image */}
      {game.coverImage ? (
        <div className="-mx-5 -mt-5 mb-2 overflow-hidden rounded-t-2xl">
          <img
            src={game.coverImage}
            alt={game.title}
            className="h-40 w-full object-cover transition group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="-mx-5 -mt-5 mb-2 h-40 rounded-t-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
          <div className="flex h-full items-center justify-center">
            <span className="font-display text-2xl font-bold uppercase tracking-[0.1em] text-white/80">
              {game.title.charAt(0)}
            </span>
          </div>
        </div>
      )}

      {/* Header with publisher info */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            {game.user.image ? (
              <img
                src={game.user.image}
                alt={game.user.name}
                className="h-6 w-6 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600">
                {game.user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-sm font-medium text-gray-700">
              {game.user.name}
            </span>
          </div>
          <div>
            <h3 className="font-display text-base font-bold uppercase tracking-[0.06em] text-gray-900">
              {game.title}
            </h3>
            <p className="mt-1.5 text-sm leading-6 text-gray-500">
              {truncate(game.description, 120)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>
            {game.publishedAt ? formatRelativeDate(game.publishedAt) : "N/A"}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <span className="font-medium">{game.totalPlays}</span>
          <span>plays</span>
        </div>
        {topScores.length > 0 && (
          <button
            onClick={() => setShowScores(!showScores)}
            className="flex items-center gap-1.5 text-amber-600 hover:text-amber-700"
          >
            <Trophy className="size-3.5" />
            <span className="font-medium">
              {topScores[0].score.toLocaleString()}
            </span>
          </button>
        )}
      </div>

      {/* Scoreboard (expandable) */}
      {showScores && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.1em] text-amber-700">
            <Trophy className="size-3.5" />
            Top Players
          </div>
          {loadingScores ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="size-4 animate-spin text-amber-600" />
            </div>
          ) : topScores.length > 0 ? (
            <div className="space-y-1.5">
              {topScores.map((score, index) => (
                <div
                  key={score.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                        index === 0
                          ? "bg-amber-400 text-white"
                          : index === 1
                            ? "bg-gray-400 text-white"
                            : "bg-orange-400 text-white"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-700">
                      {score.playerName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-bold text-gray-900">
                      {score.score.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatRelativeDate(score.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-2 text-center text-xs text-gray-500">
              No scores yet for this game.
            </p>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-auto space-y-2">
        <div className="flex gap-2">
          <Button asChild variant="primary" className="flex-1">
            <Link href={`/play/${game.slug}`}>Play Game</Link>
          </Button>
          <Button
            variant="secondary"
            className="w-10 px-0"
            onClick={handleDownloadAssets}
            title="Download Assets"
          >
            <Download className="size-4" />
          </Button>
        </div>

        <Button
          variant="secondary"
          className="w-full"
          leading={
            isRemixing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <GitFork className="size-4" />
            )
          }
          disabled={isRemixing}
          onClick={handleRemix}
        >
          {isRemixing ? "Remixing..." : "Remix & Improve"}
        </Button>

        {remixError && <p className="text-xs text-red-600">{remixError}</p>}
      </div>
    </Panel>
  );
}
