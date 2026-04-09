import { notFound } from "next/navigation";
import { connection } from "next/server";

import { StudioShell } from "@/components/game-studio/studio-shell";
import { getOwnedGame } from "@/lib/games";
import { requireSession } from "@/lib/session";

export default async function StudioGamePage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  await connection();

  const session = await requireSession();
  const { gameId } = await params;
  const game = await getOwnedGame(gameId, session.user.id);

  if (!game) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-6 lg:px-8 lg:py-8">
      <StudioShell initialGame={game} />
    </div>
  );
}
