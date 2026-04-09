"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";

type DeleteGameButtonProps = {
  gameId: string;
  onSuccess?: () => void;
  disabled?: boolean;
};

export function DeleteGameButton({
  gameId,
  onSuccess,
  disabled,
}: DeleteGameButtonProps) {
  const [isDeleting, startDeleteTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    startDeleteTransition(async () => {
      try {
        const response = await fetch(`/api/games/${gameId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const data = (await response.json()) as { error?: string };
          throw new Error(data.error ?? "Failed to delete game");
        }

        onSuccess?.();
      } catch (error) {
        console.error("Failed to delete game:", error);
      }
    });
  }

  if (!showConfirm) {
    return (
      <Button
        variant="ghost"
        size="sm"
        leading={<Trash2 className="size-3.5" />}
        disabled={disabled || isDeleting}
        onClick={() => setShowConfirm(true)}
      >
        Delete
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-red-600">Delete?</span>
      <Button
        variant="danger"
        size="sm"
        leading={
          isDeleting ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Trash2 className="size-3.5" />
          )
        }
        disabled={isDeleting}
        onClick={handleDelete}
      >
        {isDeleting ? "Deleting..." : "Yes"}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        disabled={isDeleting}
        onClick={() => setShowConfirm(false)}
      >
        No
      </Button>
    </div>
  );
}
