import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createGameVersion, getGameVersions, restoreGameVersion } from "@/lib/games";
import { getSessionFromRequest } from "@/lib/session";

export const runtime = "nodejs";

const versionSchema = z.object({
  gameId: z.string(),
  title: z.string().min(3).max(80),
  description: z.string().min(10).max(260),
  htmlCode: z.string().min(8).max(100_000),
  cssCode: z.string().min(8).max(100_000),
  jsCode: z.string().min(8).max(120_000),
});

export async function POST(request: Request) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = versionSchema.parse(await request.json());
    const version = await createGameVersion({
      gameId: body.gameId,
      title: body.title,
      description: body.description,
      htmlCode: body.htmlCode,
      cssCode: body.cssCode,
      jsCode: body.jsCode,
    });

    revalidatePath(`/studio/${body.gameId}`);

    return Response.json({ version });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save version.";
    return Response.json({ error: message }, { status: 400 });
  }
}

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("gameId");

    if (!gameId) {
      return Response.json({ error: "gameId is required" }, { status: 400 });
    }

    const versions = await getGameVersions(gameId, session.user.id);
    return Response.json({ versions });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch versions.";
    return Response.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("gameId");
    const versionId = searchParams.get("versionId");

    if (!gameId || !versionId) {
      return Response.json({ error: "gameId and versionId are required" }, { status: 400 });
    }

    const game = await restoreGameVersion(gameId, versionId, session.user.id);

    if (!game) {
      return Response.json({ error: "Game or version not found" }, { status: 404 });
    }

    revalidatePath(`/studio/${gameId}`);
    revalidatePath(`/play/${game.slug}`);

    return Response.json({ game });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to restore version.";
    return Response.json({ error: message }, { status: 400 });
  }
}
