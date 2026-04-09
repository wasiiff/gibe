import "server-only";

import { db } from "@/lib/db";
import { hasDatabaseConfig } from "@/lib/env";
import { buildUniqueSlug } from "@/lib/slug";

type SaveGameInput = {
  userId: string;
  title: string;
  description: string;
  prompt: string;
  refinedPrompt?: string | null;
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  isPublic: boolean;
};

export async function listPublicGames(limit = 6) {
  if (!hasDatabaseConfig()) {
    return [];
  }

  return db.game.findMany({
    where: { isPublic: true },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
}

export async function listAllPublicGames() {
  if (!hasDatabaseConfig()) {
    return [];
  }

  return db.game.findMany({
    where: { isPublic: true },
    orderBy: [{ publishedAt: "desc" }],
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
}

export async function listGamesForUser(userId: string) {
  if (!hasDatabaseConfig()) {
    return [];
  }

  return db.game.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getOwnedGame(gameId: string, userId: string) {
  if (!hasDatabaseConfig()) {
    return null;
  }

  return db.game.findFirst({
    where: {
      id: gameId,
      userId,
    },
  });
}

export async function getPublicGameBySlug(slug: string) {
  if (!hasDatabaseConfig()) {
    return null;
  }

  return db.game.findFirst({
    where: {
      slug,
      isPublic: true,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
}

export async function getGameById(gameId: string) {
  if (!hasDatabaseConfig()) {
    return null;
  }

  return db.game.findFirst({
    where: {
      id: gameId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
}

export async function createGame(input: SaveGameInput) {
  const slugBase = buildUniqueSlug(
    input.title,
    crypto.randomUUID().slice(0, 6),
  );

  return db.game.create({
    data: {
      ...input,
      slug: slugBase,
      publishedAt: input.isPublic ? new Date() : null,
    },
  });
}

export async function updateGame(
  gameId: string,
  userId: string,
  input: Omit<SaveGameInput, "userId">,
) {
  const existing = await getOwnedGame(gameId, userId);

  if (!existing) {
    return null;
  }

  const nextSlug =
    existing.title === input.title
      ? existing.slug
      : buildUniqueSlug(input.title, existing.id.slice(0, 6));

  return db.game.update({
    where: { id: gameId },
    data: {
      ...input,
      slug: nextSlug,
      publishedAt:
        input.isPublic && !existing.publishedAt
          ? new Date()
          : existing.publishedAt,
    },
  });
}

type SaveVersionInput = {
  gameId: string;
  title: string;
  description: string;
  htmlCode: string;
  cssCode: string;
  jsCode: string;
};

export async function createGameVersion(input: SaveVersionInput) {
  return db.gameVersion.create({
    data: {
      gameId: input.gameId,
      title: input.title,
      description: input.description,
      htmlCode: input.htmlCode,
      cssCode: input.cssCode,
      jsCode: input.jsCode,
    },
  });
}

export async function getGameVersions(gameId: string, userId: string) {
  const game = await getOwnedGame(gameId, userId);

  if (!game) {
    return [];
  }

  return db.gameVersion.findMany({
    where: { gameId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export async function restoreGameVersion(
  gameId: string,
  versionId: string,
  userId: string,
) {
  const game = await getOwnedGame(gameId, userId);

  if (!game) {
    return null;
  }

  const version = await db.gameVersion.findFirst({
    where: { id: versionId, gameId },
  });

  if (!version) {
    return null;
  }

  return db.game.update({
    where: { id: gameId },
    data: {
      title: version.title,
      description: version.description,
      htmlCode: version.htmlCode,
      cssCode: version.cssCode,
      jsCode: version.jsCode,
    },
  });
}

export async function deleteGame(gameId: string, userId: string) {
  const existing = await getOwnedGame(gameId, userId);

  if (!existing) {
    return null;
  }

  return db.game.delete({
    where: { id: gameId },
  });
}

type RemixGameInput = {
  gameId: string;
  userId: string;
  prompt?: string;
};

export async function remixGame(input: RemixGameInput) {
  const sourceGame =
    (await getPublicGameBySlug(input.gameId)) ??
    (await getOwnedGame(input.gameId, input.userId));

  if (!sourceGame) {
    return null;
  }

  const slugBase = buildUniqueSlug(
    `Remix of ${sourceGame.title}`,
    crypto.randomUUID().slice(0, 6),
  );

  return db.game.create({
    data: {
      userId: input.userId,
      slug: slugBase,
      title: `Remix of ${sourceGame.title}`,
      description: sourceGame.description,
      prompt: input.prompt ?? sourceGame.prompt,
      refinedPrompt: sourceGame.refinedPrompt,
      htmlCode: sourceGame.htmlCode,
      cssCode: sourceGame.cssCode,
      jsCode: sourceGame.jsCode,
      isPublic: false,
    },
  });
}
