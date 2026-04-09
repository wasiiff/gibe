import { NextRequest } from "next/server";
import JSZip from "jszip";

import { getGameById, getPublicGameBySlug, getOwnedGame } from "@/lib/games";
import { getSessionFromRequest } from "@/lib/session";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> },
) {
  const { gameId } = await params;

  // Try to get the game by ID
  let game = await getGameById(gameId);

  if (!game) {
    return Response.json({ error: "Game not found" }, { status: 404 });
  }

  // Check if game is public or user owns it
  const session = await getSessionFromRequest(request);

  if (!game.isPublic) {
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ownedGame = await getOwnedGame(gameId, session.user.id);
    if (!ownedGame) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Create ZIP file with game assets
  const zip = new JSZip();

  // Add game code files
  zip.file("index.html", game.htmlCode);
  zip.file("styles.css", game.cssCode);
  zip.file("script.js", game.jsCode);

  // Add metadata
  const metadata = {
    title: game.title,
    description: game.description,
    author: game.user.name,
    publishedAt: game.publishedAt,
    slug: game.slug,
  };
  zip.file("metadata.json", JSON.stringify(metadata, null, 2));

  // Add a README
  const readme = `# ${game.title}

${game.description}

Created by: ${game.user.name}

## Files
- \`index.html\` - Main HTML structure
- \`styles.css\` - Styling and visuals
- \`script.js\` - Game logic and interactivity

## How to Run
Open \`index.html\` in a web browser to play the game.

## Remix
Want to improve this game? Remix it on Gibe and add your own features!
`;
  zip.file("README.md", readme);

  // Generate ZIP buffer
  const zipBuffer = await zip.generateAsync({
    type: "uint8array",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  // Create filename slug
  const filename = `${game.slug}-assets.zip`;

  return new Response(zipBuffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
