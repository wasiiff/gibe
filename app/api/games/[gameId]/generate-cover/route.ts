import { revalidatePath } from "next/cache";
import { z } from "zod";

import { generateGameCoverImage } from "@/lib/ai";
import { getOwnedGame } from "@/lib/games";
import { getSessionFromRequest } from "@/lib/session";
import { rateLimit, getRateLimitHeaders } from "@/lib/rate-limit";

export const runtime = "nodejs";

const coverImageLimiter = rateLimit;

const schema = z.object({
  gameId: z.string(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;

  const session = await getSessionFromRequest(request);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limiting
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const rateLimitResult = await rateLimit(ip, { max: 10, windowMs: 60 * 1000 });

  if (!rateLimitResult.success) {
    return Response.json(
      { error: "Too many requests. Try again later." },
      {
        status: 429,
        headers: getRateLimitHeaders(rateLimitResult),
      }
    );
  }

  const game = await getOwnedGame(gameId, session.user.id);

  if (!game) {
    return Response.json({ error: "Game not found" }, { status: 404 });
  }

  try {
    // Generate cover image using game description and title
    const prompt = `${game.title} - ${game.description}`;
    const coverImage = await generateGameCoverImage(prompt);

    // Update game with cover image
    const { db } = await import("@/lib/db");
    await db.game.update({
      where: { id: gameId },
      data: { coverImage },
    });

    revalidatePath(`/studio/${gameId}`);
    revalidatePath(`/play/${game.slug}`);
    revalidatePath("/games");
    revalidatePath("/dashboard");

    return Response.json({ coverImage });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate cover image";
    return Response.json({ error: message }, { status: 500 });
  }
}
