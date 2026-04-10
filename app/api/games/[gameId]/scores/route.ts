import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getGameById, submitScore, getTopScores } from "@/lib/games";
import { rateLimit, getRateLimitHeaders } from "@/lib/rate-limit";

export const runtime = "nodejs";

const scoreSchema = z.object({
  playerName: z.string().min(1).max(50),
  score: z.number().int().min(0),
  metadata: z.unknown().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;

  // Rate limiting
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const rateLimitResult = await rateLimit(ip, { max: 20, windowMs: 60 * 1000 });

  if (!rateLimitResult.success) {
    return Response.json(
      { error: "Too many score submissions. Try again later." },
      {
        status: 429,
        headers: getRateLimitHeaders(rateLimitResult),
      }
    );
  }

  const game = await getGameById(gameId);

  if (!game || !game.isPublic) {
    return Response.json({ error: "Game not found" }, { status: 404 });
  }

  try {
    const body = scoreSchema.parse(await request.json());

    const score = await submitScore({
      gameId: game.id,
      playerName: body.playerName,
      score: body.score,
      metadata: body.metadata as Record<string, unknown> | undefined,
    });

    if (!score) {
      return Response.json({ error: "Failed to submit score" }, { status: 500 });
    }

    revalidatePath(`/play/${game.slug}`);
    revalidatePath("/games");

    return Response.json({ score });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid score data";
    return Response.json({ error: message }, { status: 400 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get("limit") ?? "10", 10);

  const game = await getGameById(gameId);

  if (!game) {
    return Response.json({ error: "Game not found" }, { status: 404 });
  }

  const scores = await getTopScores(game.id, Math.min(limit, 100));

  return Response.json({ scores });
}
