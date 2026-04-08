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
      // Defer state update to next tick to avoid cascading renders
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
    <div className="fixed inset-0 z-50 flex flex-col bg-[#060816]">
      <div className="flex items-center justify-between border-b border-white/10 bg-[#0A0F1E]/90 px-6 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <h2 className="font-display text-xl uppercase tracking-[0.08em] text-white">
            {title}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInstructions(true)}
          >
            <HelpCircle className="size-4" />
            How to Play
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => onClose?.()}>
            <Minimize2 className="size-4" />
            Exit Fullscreen
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onClose?.()}>
            <X className="size-4" />
            Close
          </Button>
        </div>
      </div>

      <div className="relative flex-1">
        <iframe
          srcDoc={srcDoc}
          title={title + " fullscreen"}
          className="h-full w-full border-0 bg-[#050816]"
          sandbox="allow-scripts allow-pointer-lock"
          referrerPolicy="no-referrer"
        />

        {showInstructions && !gameStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <Panel className="max-w-lg p-8">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-400/10">
                  <HelpCircle className="size-8 text-cyan-200" />
                </div>
                <h3 className="font-display text-3xl uppercase tracking-[0.08em] text-white">
                  How to Play
                </h3>
                <p className="mt-2 text-lg text-cyan-200">{title}</p>
              </div>

              {howToPlay.length > 0 && (
                <div className="mt-6 space-y-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Controls & Instructions
                  </p>
                  <ul className="space-y-2 text-left text-sm leading-7 text-slate-200">
                    {howToPlay.map((instruction, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-400" />
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
                <p className="mt-3 text-xs text-slate-500">
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
