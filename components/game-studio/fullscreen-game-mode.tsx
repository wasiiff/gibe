"use client";

import { Maximize2, Minimize2, X, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

type FullscreenGameModeProps = {
  srcDoc: string;
  title: string;
  howToPlay?: string[];
  onClose?: () => void;
};

export function FullscreenGameMode({
  srcDoc,
  title,
  howToPlay = [],
  onClose,
}: FullscreenGameModeProps) {
  const [showInstructions, setShowInstructions] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("game-instructions-" + title);
    if (dismissed) {
      requestAnimationFrame(() => {
        setShowInstructions(false);
      });
    }
  }, [title]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose?.();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleStartGame() {
    setShowInstructions(false);
    setGameStarted(true);
    localStorage.setItem("game-instructions-" + title, "true");
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-100">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center gap-4">
          <h2 className="font-display text-lg font-bold uppercase tracking-[0.08em] text-gray-900">
            {title}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            leading={<HelpCircle className="size-4" />}
            onClick={() => setShowInstructions(true)}
          >
            How to Play
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            leading={<Minimize2 className="size-4" />}
            onClick={() => onClose?.()}
          >
            Exit Fullscreen
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leading={<X className="size-4" />}
            onClick={() => onClose?.()}
          >
            Close
          </Button>
        </div>
      </div>

      {/* Game Area */}
      <div className="relative flex-1">
        <iframe
          srcDoc={srcDoc}
          title={title + " fullscreen"}
          className="h-full w-full border-0"
          sandbox="allow-scripts allow-pointer-lock"
          referrerPolicy="no-referrer"
        />

        {/* Instructions Overlay */}
        {showInstructions && !gameStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Panel className="max-w-md p-8">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                  <HelpCircle className="size-7 text-gray-500" />
                </div>
                <h3 className="font-display text-2xl font-bold uppercase tracking-[0.06em] text-gray-900">
                  How to Play
                </h3>
                <p className="mt-2 text-lg text-blue-600">{title}</p>
              </div>

              {howToPlay.length > 0 && (
                <div className="mt-6 space-y-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
                    Controls & Instructions
                  </p>
                  <ul className="space-y-2 text-left text-sm text-gray-600">
                    {howToPlay.map((instruction, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600" />
                        {instruction}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-8">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleStartGame}
                  className="w-full"
                >
                  Start Game
                </Button>
                <p className="mt-3 text-xs text-gray-400">
                  Press ESC anytime to exit fullscreen mode
                </p>
              </div>
            </Panel>
          </div>
        )}
      </div>
    </div>
  );
}
