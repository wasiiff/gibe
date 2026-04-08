import { z } from "zod";

import { generateGameFromPrompt } from "@/lib/ai";
import { getRateLimitHeaders, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const requestSchema = z.object({
  prompt: z.string().min(8).max(2_000),
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const limitResult = await rateLimit(ip, {
      max: 5,
      windowMs: 10 * 60 * 1000,
    });
    const headers = getRateLimitHeaders(limitResult);

    if (!limitResult.success) {
      return Response.json(
        { error: "Too many requests. Please try again in a few minutes." },
        { status: 429, headers },
      );
    }

    const body = requestSchema.parse(await request.json());
    const payload = await generateGameFromPrompt(body.prompt);
    return Response.json(payload, { headers });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to generate a game right now.";
    const status = error instanceof z.ZodError ? 400 : 500;

    return Response.json({ error: message }, { status });
  }
}
