import { Trophy } from "lucide-react";

import { Panel } from "@/components/ui/panel";
import { formatRelativeDate } from "@/lib/utils";

type Score = {
  id: string;
  playerName: string;
  score: number;
  createdAt: Date | string;
};

type ScoreboardProps = {
  scores: Score[];
  className?: string;
};

export function Scoreboard({ scores, className }: ScoreboardProps) {
  if (scores.length === 0) {
    return (
      <div className={className}>
        <Panel className="p-6 text-center">
          <Trophy className="mx-auto size-8 text-gray-300" />
          <p className="mt-2 text-sm text-gray-500">
            No scores yet. Be the first!
          </p>
        </Panel>
      </div>
    );
  }

  const medalColors = [
    "bg-amber-400 text-white",
    "bg-gray-400 text-white",
    "bg-orange-400 text-white",
  ];

  return (
    <div className={className}>
      <div className="space-y-2">
        {scores.slice(0, 3).map((entry, index) => (
          <div
            key={entry.id}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${medalColors[index] ?? "bg-gray-300 text-white"}`}
              >
                {index + 1}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {entry.playerName}
              </span>
            </div>
            <div className="text-right">
              <p className="font-display text-sm font-bold text-gray-900">
                {entry.score.toLocaleString()}
              </p>
              <p className="text-[10px] text-gray-400">
                {formatRelativeDate(entry.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {scores.length > 3 && (
        <p className="mt-2 text-center text-xs text-gray-400">
          +{scores.length - 3} more scores
        </p>
      )}
    </div>
  );
}
