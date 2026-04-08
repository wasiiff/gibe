"use client";

import { History, RotateCcw, Save } from "lucide-react";
import { useState, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { formatRelativeDate } from "@/lib/utils";

type Version = {
  id: string;
  title: string;
  description: string;
  createdAt: Date | string;
};

type VersionHistoryProps = {
  gameId: string;
  currentTitle: string;
  currentDescription: string;
  currentHtml: string;
  currentCss: string;
  currentJs: string;
  versions: Version[];
  onRestore: (versionId: string) => void;
};

export function VersionHistory({
  gameId,
  currentTitle,
  currentDescription,
  currentHtml,
  currentCss,
  currentJs,
  versions,
  onRestore,
}: VersionHistoryProps) {
  const [isSaving, startSaveTransition] = useTransition();
  const [showVersions, setShowVersions] = useState(false);

  async function saveVersion() {
    startSaveTransition(async () => {
      try {
        await fetch("/api/games/versions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gameId,
            title: currentTitle,
            description: currentDescription,
            htmlCode: currentHtml,
            cssCode: currentCss,
            jsCode: currentJs,
          }),
        });
      } catch (error) {
        console.error("Failed to save version:", error);
      }
    });
  }

  async function restoreVersion(versionId: string) {
    try {
      const response = await fetch(
        `/api/games/versions?gameId=${gameId}&versionId=${versionId}`,
        { method: "PATCH" },
      );

      if (response.ok) {
        onRestore(versionId);
      }
    } catch (error) {
      console.error("Failed to restore version:", error);
    }
  }

  return (
    <Panel className="p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Badge className="text-purple-200">
            <History className="size-3.5" />
            Version History
          </Badge>
          <span className="text-xs text-slate-400">
            {versions.length} version{versions.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="sm"
            leading={<Save className="size-4" />}
            disabled={isSaving}
            onClick={saveVersion}
          >
            {isSaving ? "Saving..." : "Save Version"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowVersions(!showVersions)}
          >
            {showVersions ? "Hide" : "Show"}
          </Button>
        </div>
      </div>

      {showVersions && (
        <div className="mt-5 space-y-3">
          {versions.length === 0 ? (
            <p className="rounded-[22px] border border-dashed border-white/10 p-5 text-center text-sm leading-7 text-slate-400">
              No versions saved yet. Save your first version to track changes.
            </p>
          ) : (
            versions.map((version, index) => (
              <div
                key={version.id}
                className="group rounded-[22px] border border-white/8 bg-white/4 p-4 transition hover:border-purple-300/20"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        v{versions.length - index}
                      </span>
                      {index === 0 && (
                        <Badge className="text-emerald-200">Latest</Badge>
                      )}
                    </div>
                    <h4 className="mt-2 font-display text-lg uppercase tracking-[0.06em] text-white">
                      {version.title}
                    </h4>
                    <p className="mt-1 text-sm text-slate-300">
                      {version.description}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      {formatRelativeDate(version.createdAt)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    leading={<RotateCcw className="size-4" />}
                    disabled={index === 0}
                    onClick={() => restoreVersion(version.id)}
                  >
                    Restore
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </Panel>
  );
}
