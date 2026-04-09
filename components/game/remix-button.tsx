"use client";

import { GitFork, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";

type RemixButtonProps = {
  gameId: string;
  onSuccess?: (gameId: string) => void;
  className?: string;
};

export function RemixButton({
  gameId,
  onSuccess,
  className,
}: RemixButtonProps) {
  const [isRemixing, startRemixTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleRemix() {
    setError(null);
    startRemixTransition(async () => {
      try {
        const response = await fetch("/api/games/remix", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameId }),
        });

        if (!response.ok) {
          const data = (await response.json()) as { error?: string };
          throw new Error(data.error ?? "Failed to remix game");
        }

        const payload = (await response.json()) as {
          game: { id: string; slug: string };
        };
        onSuccess?.(payload.game.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to remix game");
      }
    });
  }

  return (
    <div className={className}>
      <Button
        variant="secondary"
        className="w-full"
        leading={
          isRemixing ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <GitFork className="size-4" />
          )
        }
        disabled={isRemixing}
        onClick={handleRemix}
      >
        {isRemixing ? "Remixing..." : "Remix"}
      </Button>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
