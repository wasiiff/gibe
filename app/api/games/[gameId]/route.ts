import { revalidatePath } from "next/cache";
import { z } from "zod";

import { updateGame } from "@/lib/games";
import { getSessionFromRequest } from "@/lib/session";

export const runtime = "nodejs";

const saveGameSchema = z.object({
  title: z.string().min(3).max(80),
  description: z.string().min(10).max(260),
  prompt: z.string().min(8).max(2_000),
  refinedPrompt: z.string().max(6_000).nullable().optional(),
  htmlCode: z.string().min(8).max(100_000),
  cssCode: z.string().min(8).max(100_000),
  jsCode: z.string().min(8).max(120_000),
  isPublic: z.boolean(),
});

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/games/[gameId]">,
) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [{ gameId }, body] = await Promise.all([
      context.params,
      request.json().then((value) => saveGameSchema.parse(value)),
    ]);

    const game = await updateGame(gameId, session.user.id, body);

    if (!game) {
      return Response.json({ error: "Game not found" }, { status: 404 });
    }

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath(`/studio/${game.id}`);
    revalidatePath(`/play/${game.slug}`);

    return Response.json({ game });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update the game.";
    return Response.json({ error: message }, { status: 400 });
  }
}

