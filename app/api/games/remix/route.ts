import { revalidatePath } from "next/cache";
import { z } from "zod";

import { remixGame } from "@/lib/games";
import { getSessionFromRequest } from "@/lib/session";

export const runtime = "nodejs";

const remixSchema = z.object({
  gameId: z.string(),
  prompt: z.string().max(2_000).optional(),
});

export async function POST(request: Request) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = remixSchema.parse(await request.json());
    const game = await remixGame({
      gameId: body.gameId,
      userId: session.user.id,
      prompt: body.prompt,
    });

    if (!game) {
      return Response.json({ error: "Game not found" }, { status: 404 });
    }

    revalidatePath("/dashboard");
    revalidatePath(`/studio/${game.id}`);

    return Response.json({ game });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to remix the game.";
    return Response.json({ error: message }, { status: 400 });
  }
}
