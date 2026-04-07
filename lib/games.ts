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

export async function createGame(input: SaveGameInput) {
  const slugBase = buildUniqueSlug(input.title, crypto.randomUUID().slice(0, 6));

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
        input.isPublic && !existing.publishedAt ? new Date() : existing.publishedAt,
    },
  });
}

