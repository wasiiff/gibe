"use client";

import { Trophy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ScoreSubmitModal } from "@/components/game/score-submit-modal";

type ScoreSubmitButtonProps = {
  gameId: string;
};

export function ScoreSubmitButton({ gameId }: ScoreSubmitButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function handleSubmit(playerName: string, score: number) {
    const response = await fetch(`/api/games/${gameId}/scores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerName,
        score,
      }),
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      throw new Error(data.error ?? "Failed to submit score");
    }

    // Reload the page to show updated scores
    window.location.reload();
  }

  return (
    <>
      <Button
        variant="primary"
        className="w-full"
        leading={<Trophy className="size-4" />}
        onClick={() => setIsModalOpen(true)}
      >
        Submit Score
      </Button>
      <ScoreSubmitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
