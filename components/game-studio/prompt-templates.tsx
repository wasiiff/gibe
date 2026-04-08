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
      "A neon survival arena where the player dodges incoming hazards, collects energy shards for points, and tries to survive as long as possible with escalating difficulty.",
    color: "text-cyan-200",
  },
  {
    id: "platformer",
    icon: Target,
    category: "Platformer",
    title: "Cloud Jumper",
    prompt:
      "A side-scrolling platformer where the player jumps between floating clouds, collects coins, avoids falling off screen, and tries to reach the highest altitude.",
    color: "text-emerald-200",
  },
  {
    id: "puzzle-match",
    icon: Grid3X3,
    category: "Puzzle",
    title: "Gem Matcher",
    prompt:
      "A match-3 puzzle game where players swap adjacent gems to create lines of 3 or more matching gems, with combo bonuses and a move limit.",
    color: "text-amber-200",
  },
  {
    id: "racing",
    icon: Trophy,
    category: "Racing",
    title: "Neon Speedway",
    prompt:
      "A top-down racing game where the player navigates a track, avoids obstacles, collects speed boosts, and tries to complete laps before time runs out.",
    color: "text-pink-200",
  },
  {
    id: "shooter",
    icon: Target,
    category: "Shooter",
    title: "Space Defender",
    prompt:
      "A space shooter where the player controls a ship at the bottom, shoots incoming asteroids and enemies, earns points for each destroy, and loses lives when hit.",
    color: "text-purple-200",
  },
  {
    id: "snake",
    icon: Gamepad2,
    category: "Classic",
    title: "Neon Snake",
    prompt:
      "A modern take on the classic snake game with neon aesthetics, where the player grows longer by eating food and must avoid hitting walls or themselves.",
    color: "text-green-200",
  },
];

type PromptTemplatesProps = {
  onSelect: (prompt: string) => void;
};

export function PromptTemplates({ onSelect }: PromptTemplatesProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
          Templates
        </p>
        <Badge className="text-slate-300">{templates.length}</Badge>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template.prompt)}
            className="group text-left"
          >
            <Panel className="p-3 transition hover:-translate-y-0.5 hover:border-cyan-300/20">
              <div className="flex items-center gap-2">
                <template.icon className={`size-4 ${template.color}`} />
                <div className="flex-1">
                  <p className="text-xs font-medium text-white">
                    {template.title}
                  </p>
                  <p className="text-[10px] text-slate-400">
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
