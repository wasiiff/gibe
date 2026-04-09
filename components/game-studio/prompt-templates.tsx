"use client";

import { Gamepad2, Grid3X3, Target, Trophy, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";

type PromptTemplate = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  title: string;
  prompt: string;
  color: string;
};

const templates: PromptTemplate[] = [
  {
    id: "arcade-survival",
    icon: Zap,
    category: "Arcade",
    title: "Survival Arena",
    prompt:
      "A survival arena where the player dodges hazards, collects points, and tries to survive as long as possible with escalating difficulty.",
    color: "text-blue-600",
  },
  {
    id: "platformer",
    icon: Target,
    category: "Platformer",
    title: "Cloud Jumper",
    prompt:
      "A platformer where the player jumps between floating platforms, collects coins, and tries to reach the highest altitude.",
    color: "text-green-600",
  },
  {
    id: "puzzle-match",
    icon: Grid3X3,
    category: "Puzzle",
    title: "Gem Matcher",
    prompt:
      "A match-3 puzzle game where players swap adjacent gems to create lines of 3 or more, with combo bonuses.",
    color: "text-amber-600",
  },
  {
    id: "racing",
    icon: Trophy,
    category: "Racing",
    title: "Speed Run",
    prompt:
      "A top-down racing game where the player navigates a track, avoids obstacles, and completes laps before time runs out.",
    color: "text-red-600",
  },
  {
    id: "shooter",
    icon: Target,
    category: "Shooter",
    title: "Space Defender",
    prompt:
      "A space shooter where the player controls a ship, shoots enemies, earns points, and loses lives when hit.",
    color: "text-purple-600",
  },
  {
    id: "snake",
    icon: Gamepad2,
    category: "Classic",
    title: "Snake",
    prompt:
      "The classic snake game where the player grows by eating food and must avoid hitting walls or themselves.",
    color: "text-emerald-600",
  },
];

type PromptTemplatesProps = { onSelect: (prompt: string) => void };

export function PromptTemplates({ onSelect }: PromptTemplatesProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
          Templates
        </p>
        <Badge>{templates.length}</Badge>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template.prompt)}
            className="group text-left"
          >
            <Panel className="p-3 transition hover:border-gray-300">
              <div className="flex items-center gap-2">
                <template.icon className={`size-4 ${template.color}`} />
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-900">
                    {template.title}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {template.category}
                  </p>
                </div>
              </div>
            </Panel>
          </button>
        ))}
      </div>
    </div>
  );
}
