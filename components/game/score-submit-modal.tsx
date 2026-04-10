"use client";

import { Trophy, X, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

type ScoreSubmitModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (playerName: string, score: number) => Promise<void>;
};

export function ScoreSubmitModal({
  isOpen,
  onClose,
  onSubmit,
}: ScoreSubmitModalProps) {
  const [playerName, setPlayerName] = useState("");
  const [score, setScore] = useState("");
  const [isSubmitting, startSubmitTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);

    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }

    const scoreNum = parseInt(score, 10);
    if (!score || isNaN(scoreNum) || scoreNum < 0) {
      setError("Please enter a valid score");
      return;
    }

    startSubmitTransition(async () => {
      try {
        await onSubmit(playerName.trim(), scoreNum);
        setPlayerName("");
        setScore("");
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to submit score");
      }
    });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Panel className="w-full max-w-md p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="size-5 text-amber-600" />
            <h3 className="font-display text-lg font-bold uppercase tracking-[0.06em] text-gray-900">
              Submit Score
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="playerName"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Your Name
            </label>
            <input
              id="playerName"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={50}
              placeholder="Enter your name"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-900 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="score"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Score
            </label>
            <input
              id="score"
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              min="0"
              placeholder="Enter your score"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-900 focus:outline-none"
            />
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              leading={
                isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null
              }
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Submitting..." : "Submit Score"}
            </Button>
          </div>
        </div>
      </Panel>
    </div>
  );
}
