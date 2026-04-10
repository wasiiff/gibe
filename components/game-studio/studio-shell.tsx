"use client";

import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Code2,
  Eye,
  FileCode,
  Globe2,
  LoaderCircle,
  MessageSquare,
  Play,
  Save,
  Shield,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react";
import { useDeferredValue, useState, useTransition } from "react";

import { CodeEditor } from "@/components/game-studio/code-editor";
import { GamePreview } from "@/components/game-studio/game-preview";
import { PromptTemplates } from "@/components/game-studio/prompt-templates";
import { ShareLinkButton } from "@/components/game/share-link-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { StepIndicator } from "@/components/game-studio/step-indicator";
import { buildPreviewDocument } from "@/lib/preview-document";
import {
  starterBundle,
  starterGame,
  starterRefinement,
} from "@/lib/starter-game";
import type { CodeBundle, PromptRefinement, RuntimeMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

type StudioGame = {
  id: string;
  slug: string;
  title: string;
  description: string;
  prompt: string;
  refinedPrompt: string | null;
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  isPublic: boolean;
};

const tabStyles = {
  html: "border-amber-300 bg-amber-50 text-amber-700",
  css: "border-blue-300 bg-blue-50 text-blue-700",
  javascript: "border-emerald-300 bg-emerald-50 text-emerald-700",
} as const;

const defaultPrompt =
  "Build a survival arena where the player dodges hazards and collects points.";

type ViewMode = "prompt" | "preview" | "code";

export function StudioShell({
  initialGame,
}: {
  initialGame: StudioGame | null;
}) {
  const router = useRouter();
  const [gameId, setGameId] = useState(initialGame?.id ?? null);
  const [slug, setSlug] = useState(initialGame?.slug ?? null);
  const [title, setTitle] = useState(initialGame?.title ?? starterGame.title);
  const [description, setDescription] = useState(
    initialGame?.description ?? starterGame.description,
  );
  const [prompt, setPrompt] = useState(initialGame?.prompt ?? defaultPrompt);
  const [refinement, setRefinement] = useState<PromptRefinement | null>(
    initialGame?.refinedPrompt
      ? {
          ...starterRefinement,
          refinedPrompt: initialGame.refinedPrompt,
          title: initialGame.title,
          description: initialGame.description,
        }
      : starterRefinement,
  );
  const [howToPlay, setHowToPlay] = useState(starterGame.howToPlay);
  const [bundle, setBundle] = useState<CodeBundle>({
    html: initialGame?.htmlCode ?? starterBundle.html,
    css: initialGame?.cssCode ?? starterBundle.css,
    js: initialGame?.jsCode ?? starterBundle.js,
  });
  const [activeTab, setActiveTab] = useState<"html" | "css" | "javascript">(
    "html",
  );
  const [runtimeMessages, setRuntimeMessages] = useState<RuntimeMessage[]>([]);
  const [previewState, setPreviewState] = useState<
    "syncing" | "ready" | "error"
  >("syncing");
  const [requestError, setRequestError] = useState<string | null>(null);
  const [statusLine, setStatusLine] = useState<string>(
    initialGame ? "Edit or regenerate." : "Describe your game idea.",
  );
  const [isGenerating, startGenerateTransition] = useTransition();
  const [isRepairing, startRepairTransition] = useTransition();
  const [isSaving, startSaveTransition] = useTransition();
  const [hasGenerated, setHasGenerated] = useState(initialGame !== null);
  const [hasPublished, setHasPublished] = useState(
    initialGame?.isPublic ?? false,
  );
  const [showTemplates, setShowTemplates] = useState(false);
  const [mobileView, setMobileView] = useState<ViewMode>("prompt");

  const deferredBundle = useDeferredValue(bundle);
  const previewDocument = buildPreviewDocument(deferredBundle);
  const shareUrl =
    slug && typeof window !== "undefined"
      ? `${window.location.origin}/play/${slug}`
      : null;

  const steps = [
    {
      number: 1,
      label: "Describe",
      completed: prompt.length > 10,
      active: !hasGenerated,
    },
    {
      number: 2,
      label: "Generate",
      completed: hasGenerated,
      active: isGenerating,
    },
    {
      number: 3,
      label: "Play",
      completed: previewState === "ready",
      active: previewState === "ready",
    },
    {
      number: 4,
      label: "Refine",
      completed: runtimeMessages.length === 0 && hasGenerated,
      active: previewState === "error",
    },
    {
      number: 5,
      label: "Publish",
      completed: hasPublished,
      active: hasGenerated && previewState === "ready",
    },
  ];

  async function requestJson<T>(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    const data = (await response.json()) as T & { error?: string };
    if (!response.ok) throw new Error(data.error ?? "Request failed.");
    return data;
  }

  function applyBundle(nextBundle: CodeBundle) {
    setPreviewState("syncing");
    setRuntimeMessages([]);
    setBundle({
      html: nextBundle.html,
      css: nextBundle.css,
      js: nextBundle.js,
    });
  }

  function updateBundlePart(part: keyof CodeBundle, value: string) {
    setPreviewState("syncing");
    setRuntimeMessages([]);
    setBundle((current) => ({ ...current, [part]: value }));
  }

  function pushRuntimeMessage(message: RuntimeMessage) {
    setRuntimeMessages((current) => [message, ...current].slice(0, 8));
  }

  async function handleGenerate() {
    setRequestError(null);
    setShowTemplates(false);
    setStatusLine("Generating...");
    startGenerateTransition(async () => {
      try {
        const payload = await requestJson<{
          refinement: PromptRefinement;
          game: {
            title: string;
            description: string;
            html: string;
            css: string;
            js: string;
            howToPlay: string[];
          };
        }>("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });
        setTitle(payload.game.title);
        setDescription(payload.game.description);
        setRefinement(payload.refinement);
        setHowToPlay(payload.game.howToPlay);
        applyBundle({
          html: payload.game.html,
          css: payload.game.css,
          js: payload.game.js,
        });
        setHasGenerated(true);
        setPreviewState("ready");
        setStatusLine("Ready! Play or publish.");
        setMobileView("preview");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to generate.";
        setRequestError(message);
        setStatusLine("Failed. Try again.");
      }
    });
  }

  async function handleRepair() {
    const latestRuntimeMessage = runtimeMessages.find(
      (entry) => entry.type !== "ready",
    );
    if (!latestRuntimeMessage || !refinement) return;
    setRequestError(null);
    setStatusLine("Fixing...");
    startRepairTransition(async () => {
      try {
        const payload = await requestJson<{
          summary: string;
          html: string;
          css: string;
          js: string;
        }>("/api/ai/fix", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            refinement,
            bundle,
            runtimeError: latestRuntimeMessage.message ?? "Unknown error",
          }),
        });
        applyBundle({ html: payload.html, css: payload.css, js: payload.js });
        setStatusLine(payload.summary);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to repair.";
        setRequestError(message);
        setStatusLine("Repair failed.");
      }
    });
  }

  async function saveGame(isPublic: boolean, generateCover = false) {
    setRequestError(null);
    setStatusLine(isPublic ? "Publishing..." : "Saving...");
    startSaveTransition(async () => {
      try {
        const body = {
          title,
          description,
          prompt,
          refinedPrompt: refinement?.refinedPrompt ?? null,
          htmlCode: bundle.html,
          cssCode: bundle.css,
          jsCode: bundle.js,
          isPublic,
        };
        const endpoint = gameId ? `/api/games/${gameId}` : "/api/games";
        const method = gameId ? "PATCH" : "POST";
        const payload = await requestJson<{
          game: { id: string; slug: string; isPublic: boolean };
        }>(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        setGameId(payload.game.id);
        setSlug(payload.game.slug);
        setHasPublished(payload.game.isPublic);
        setStatusLine(payload.game.isPublic ? "Published!" : "Saved.");

        // Generate cover image if publishing and requested
        if (isPublic && generateCover && !payload.game.isPublic) {
          try {
            setStatusLine("Generating cover image...");
            await fetch(`/api/games/${payload.game.id}/generate-cover`, {
              method: "POST",
            });
          } catch (err) {
            // Non-critical, continue if it fails
            console.error("Cover image generation failed:", err);
          }
        }

        router.replace(`/studio/${payload.game.id}`);
        router.refresh();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to save.";
        setRequestError(message);
        setStatusLine("Save failed.");
      }
    });
  }

  function handleTemplateSelect(templatePrompt: string) {
    setPrompt(templatePrompt);
    setShowTemplates(false);
    setStatusLine("Template loaded. Click Generate.");
  }

  return (
    <div className="space-y-4">
      <Panel className="p-3">
        <StepIndicator steps={steps} />
      </Panel>

      <div className="flex gap-2 lg:hidden">
        {(["prompt", "preview", "code"] as const).map((view) => (
          <Button
            key={view}
            variant={mobileView === view ? "primary" : "secondary"}
            size="sm"
            leading={
              view === "prompt" ? (
                <MessageSquare className="size-4" />
              ) : view === "preview" ? (
                <Eye className="size-4" />
              ) : (
                <FileCode className="size-4" />
              )
            }
            onClick={() => setMobileView(view)}
            className="flex-1"
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1.6fr]">
        <div
          className={cn(
            "space-y-4",
            mobileView !== "prompt" && "hidden lg:block",
          )}
        >
          <Panel className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <Badge className="border-blue-200 bg-blue-50 text-blue-700">
                <Sparkles className="size-3" />
                Step 1
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTemplates(!showTemplates)}
              >
                {showTemplates ? "Hide" : "Templates"}
              </Button>
            </div>

            <label className="block space-y-2">
              <span className="block text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                Game Idea
              </span>
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                className="min-h-[100px] w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm leading-6 text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-400"
                placeholder="A platformer where you jump between clouds..."
              />
            </label>

            {showTemplates && (
              <div className="mt-4">
                <PromptTemplates onSelect={handleTemplateSelect} />
              </div>
            )}

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="block text-xs uppercase tracking-[0.18em] text-gray-400">
                  Title
                </span>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none transition focus:border-blue-400"
                  placeholder="Game name"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="block text-xs uppercase tracking-[0.18em] text-gray-400">
                  Description
                </span>
                <input
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none transition focus:border-blue-400"
                  placeholder="Short description"
                />
              </label>
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                variant="primary"
                size="sm"
                leading={
                  isGenerating ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <Zap className="size-4" />
                  )
                }
                disabled={isGenerating || isRepairing || prompt.length < 8}
                onClick={handleGenerate}
                className="flex-1"
              >
                {isGenerating
                  ? "Generating..."
                  : hasGenerated
                    ? "Regenerate"
                    : "Generate"}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leading={
                  isRepairing ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <Wand2 className="size-4" />
                  )
                }
                disabled={
                  isGenerating ||
                  isRepairing ||
                  runtimeMessages.every((m) => m.type === "ready")
                }
                onClick={handleRepair}
              >
                Fix
              </Button>
            </div>

            {requestError && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {requestError}
              </div>
            )}
            {statusLine && (
              <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
                {statusLine}
              </div>
            )}
          </Panel>

          {refinement && hasGenerated && (
            <Panel className="p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
                Game Blueprint
              </p>
              <div className="mt-3 space-y-3">
                <div>
                  <p className="text-xs font-medium text-blue-600">Gameplay</p>
                  <ul className="mt-1 space-y-1 text-xs text-gray-600">
                    {refinement.gameplayLoop.slice(0, 3).map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[...refinement.visualStyle, ...refinement.constraints]
                    .slice(0, 6)
                    .map((item) => (
                      <Badge
                        key={item}
                        className="border-gray-200 bg-gray-50 text-[10px] normal-case text-gray-600"
                      >
                        {item}
                      </Badge>
                    ))}
                </div>
              </div>
            </Panel>
          )}
        </div>

        <div
          className={cn(
            "space-y-4",
            mobileView === "prompt" && "hidden lg:block",
          )}
        >
          <Panel className="overflow-hidden p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Badge
                  className={cn(
                    previewState === "error"
                      ? "border-red-200 bg-red-50 text-red-700"
                      : previewState === "ready"
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-blue-200 bg-blue-50 text-blue-700",
                  )}
                >
                  {previewState === "error" ? (
                    <AlertTriangle className="size-3" />
                  ) : previewState === "ready" ? (
                    <Play className="size-3" />
                  ) : (
                    <LoaderCircle className="size-3 animate-spin" />
                  )}
                  {previewState === "error"
                    ? "Error"
                    : previewState === "ready"
                      ? "Ready"
                      : "Loading"}
                </Badge>
                <Badge className="border-gray-200 bg-gray-50 text-gray-600">
                  <Shield className="size-3" />
                  {title}
                </Badge>
              </div>
              <div className="flex gap-2">
                {shareUrl && <ShareLinkButton href={shareUrl} />}
                <Button
                  variant="secondary"
                  size="sm"
                  leading={<Save className="size-3.5" />}
                  disabled={isSaving}
                  onClick={() => saveGame(false)}
                >
                  Save
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  leading={
                    isSaving ? (
                      <LoaderCircle className="size-3.5 animate-spin" />
                    ) : (
                      <Globe2 className="size-3.5" />
                    )
                  }
                  disabled={isSaving}
                  onClick={() => saveGame(true, true)}
                >
                  {hasPublished ? "Update" : "Publish"}
                </Button>
              </div>
            </div>
            <GamePreview
              srcDoc={previewDocument}
              title={title}
              howToPlay={howToPlay}
              onRuntimeMessage={(message) => {
                if (message.type === "ready") {
                  setPreviewState("ready");
                  return;
                }
                setPreviewState("error");
                pushRuntimeMessage(message);
              }}
            />
          </Panel>

          <div
            className={cn(
              "grid gap-4 lg:grid-cols-[1.2fr_0.8fr]",
              mobileView === "preview" && "hidden lg:grid",
            )}
          >
            <Panel className="p-4">
              <div className="mb-3 flex gap-2">
                {(["html", "css", "javascript"] as const).map((tab) => (
                  <button
                    key={tab}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] transition",
                      activeTab === tab
                        ? tabStyles[tab]
                        : "border-gray-200 bg-gray-50 text-gray-500 hover:text-gray-700",
                    )}
                    onClick={() => setActiveTab(tab)}
                    type="button"
                  >
                    {tab === "javascript" ? "JS" : tab.toUpperCase()}
                  </button>
                ))}
              </div>
              <CodeEditor
                language={activeTab}
                value={bundle[activeTab === "javascript" ? "js" : activeTab]}
                onChange={(value) => {
                  if (activeTab === "javascript") {
                    updateBundlePart("js", value);
                    return;
                  }
                  updateBundlePart(activeTab, value);
                }}
              />
            </Panel>

            <Panel className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
                  Console
                </p>
                {runtimeMessages.length > 0 && (
                  <Badge className="border-red-200 bg-red-50 text-red-700">
                    {runtimeMessages.length}
                  </Badge>
                )}
              </div>
              <div className="mt-3 space-y-2">
                {runtimeMessages.length > 0 ? (
                  runtimeMessages.slice(0, 3).map((message, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700"
                    >
                      {message.message}
                    </div>
                  ))
                ) : (
                  <p className="rounded-lg border border-dashed border-gray-200 p-4 text-center text-xs text-gray-400">
                    {hasGenerated ? "No errors" : "Generate to see output"}
                  </p>
                )}
              </div>
              {howToPlay.length > 0 && (
                <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-blue-600">
                    How to Play
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-gray-600">
                    {howToPlay.slice(0, 3).map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}
