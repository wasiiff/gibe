"use client";

import { useRouter } from "next/navigation";

import { GameCard } from "@/components/game/game-card";

type Game = {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string | null;
  isPublic: boolean;
  updatedAt: Date | string;
};

type GameCardListProps = {
  games: Game[];
};

export function GameCardList({ games }: GameCardListProps) {
  const router = useRouter();

  function handleDelete() {
    router.refresh();
  }

  if (!games.length) {
    return null;
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {games.map((game) => (
        <GameCard key={game.id} game={game} onDelete={handleDelete} />
      ))}
    </div>
  );
}
