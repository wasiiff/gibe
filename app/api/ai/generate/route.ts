import { z } from "zod";

import { generateGameFromPrompt } from "@/lib/ai";

export const runtime = "nodejs";

const requestSchema = z.object({
  prompt: z.string().min(8).max(2_000),
});

export async function POST(request: Request) {
  try {
    const body = requestSchema.parse(await request.json());
    const payload = await generateGameFromPrompt(body.prompt);
    return Response.json(payload);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to generate a game right now.";

    return Response.json({ error: message }, { status: 400 });
  }
}

