import { z } from "zod";

import { repairGameWithAi } from "@/lib/ai";
import { getRateLimitHeaders, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const requestSchema = z.object({
  prompt: z.string().min(8).max(2_000),
  runtimeError: z.string().min(4).max(6_000),
  refinement: z.object({
    title: z.string(),
    description: z.string(),
    gameplayLoop: z.array(z.string()),
    visualStyle: z.array(z.string()),
    constraints: z.array(z.string()),
    refinedPrompt: z.string(),
  }),
  bundle: z.object({
    html: z.string(),
    css: z.string(),
    js: z.string(),
  }),
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const limitResult = await rateLimit(ip, {
      max: 10,
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
    const payload = await repairGameWithAi(body);
    return Response.json(payload, { headers });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to fix the game right now.";
    const status = error instanceof z.ZodError ? 400 : 500;

    return Response.json({ error: message }, { status });
  }
}
