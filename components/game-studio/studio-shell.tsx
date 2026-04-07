"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Globe2,
  LoaderCircle,
  Play,
  Save,
  Shield,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useDeferredValue, useState, useTransition } from "react";

import { CodeEditor } from "@/components/game-studio/code-editor";
import { GamePreview } from "@/components/game-studio/game-preview";
import { ShareLinkButton } from "@/components/game/share-link-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { buildPreviewDocument } from "@/lib/preview-document";
import { starterBundle, starterGame, starterRefinement } from "@/lib/starter-game";
import type { PromptRefinement, RuntimeMessage } from "@/lib/types";
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
  html: "border-amber-300/20 bg-amber-400/10 text-amber-100",
  css: "border-cyan-300/20 bg-cyan-400/10 text-cyan-100",
  javascript: "border-emerald-300/20 bg-emerald-400/10 text-emerald-100",
} as const;

const defaultPrompt =
  "Build a neon survival arena where the player dodges hazards, grabs energy shards, and chases a high score combo.";

export function StudioShell({ initialGame }: { initialGame: StudioGame | null }) {
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
  const [bundle, setBundle] = useState({
    html: initialGame?.htmlCode ?? starterBundle.html,
    css: initialGame?.cssCode ?? starterBundle.css,
    js: initialGame?.jsCode ?? starterBundle.js,
  });
  const [activeTab, setActiveTab] = useState<"html" | "css" | "javascript">("html");
  const [runtimeMessages, setRuntimeMessages] = useState<RuntimeMessage[]>([]);
  const [previewState, setPreviewState] = useState<"syncing" | "ready" | "error">(
    "syncing",
  );
  const [requestError, setRequestError] = useState<string | null>(null);
  const [statusLine, setStatusLine] = useState<string>(
    initialGame
      ? "Loaded saved build. Edit code, refresh the preview, and publish when ready."
      : "Starter arena loaded. Replace the prompt to forge your first AI-generated game.",
  );
  const [isGenerating, startGenerateTransition] = useTransition();
  const [isRepairing, startRepairTransition] = useTransition();
  const [isSaving, startSaveTransition] = useTransition();
  const deferredBundle = useDeferredValue(bundle);
  const previewDocument = buildPreviewDocument(deferredBundle);
  const shareUrl =
    slug && typeof window !== "undefined" ? `${window.location.origin}/play/${slug}` : null;

  async function requestJson<T>(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    const data = (await response.json()) as T & { error?: string };

    if (!response.ok) {
      throw new Error(data.error ?? "Request failed.");
    }

    return data;
  }

  function applyBundle(nextBundle: typeof bundle) {
    setPreviewState("syncing");
    setRuntimeMessages([]);
    setBundle({
      html: nextBundle.html,
      css: nextBundle.css,
      js: nextBundle.js,
    });
  }

  function updateBundlePart(part: keyof typeof bundle, value: string) {
    setPreviewState("syncing");
    setRuntimeMessages([]);
    setBundle((current) => ({ ...current, [part]: value }));
  }

  function pushRuntimeMessage(message: RuntimeMessage) {
    setRuntimeMessages((current) => {
      const next = [message, ...current];
      return next.slice(0, 8);
    });
  }

  async function handleGenerate() {
    setRequestError(null);
    setStatusLine("Refining prompt and generating a fresh game build.");
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
          headers: {
            "Content-Type": "application/json",
          },
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
        setStatusLine("Fresh build forged. Run it, inspect the preview, and save when it feels right.");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to generate the game.";
        setRequestError(message);
        setStatusLine("Generation failed before the new build could land.");
      }
    });
  }

  async function handleRepair() {
    const latestRuntimeMessage = runtimeMessages.find((entry) => entry.type !== "ready");

    if (!latestRuntimeMessage || !refinement) {
      return;
    }

    setRequestError(null);
    setStatusLine("Sending the runtime fault back through the repair loop.");
    startRepairTransition(async () => {
      try {
        const payload = await requestJson<{
          summary: string;
          html: string;
          css: string;
          js: string;
        }>("/api/ai/fix", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            refinement,
            bundle,
            runtimeError: latestRuntimeMessage.message ?? "Unknown runtime error",
          }),
        });

        applyBundle({
          html: payload.html,
          css: payload.css,
          js: payload.js,
        });
        setStatusLine(payload.summary);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to repair the game.";
        setRequestError(message);
        setStatusLine("Repair loop failed. Review the runtime trace and try again.");
      }
    });
  }

  async function saveGame(isPublic: boolean) {
    setRequestError(null);
    setStatusLine(isPublic ? "Publishing build to the arcade." : "Saving private studio draft.");
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
          game: {
            id: string;
            slug: string;
            isPublic: boolean;
          };
        }>(endpoint, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        setGameId(payload.game.id);
        setSlug(payload.game.slug);
        setStatusLine(
          payload.game.isPublic
            ? "Live link published. Open the public page or copy the share URL."
            : "Private build saved to your dashboard.",
        );
        router.replace(`/studio/${payload.game.id}`);
        router.refresh();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to save the game.";
        setRequestError(message);
        setStatusLine("Save failed before the build could be persisted.");
      }
    });
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-8 xl:grid-cols-[1.05fr_1.35fr]">
        <div className="space-y-6">
          <Panel className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-3">
                <Badge className="text-cyan-200">
                  <Sparkles className="size-3.5" />
                  Prompt forge
                </Badge>
                <div className="space-y-2">
                  <h1 className="font-display text-3xl uppercase tracking-[0.08em] text-white">
                    Build a Browser Game
                  </h1>
                  <p className="text-sm leading-7 text-slate-300">
                    Refine the idea, generate a playable draft, patch runtime faults,
                    then ship a public arcade link from the same workspace.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  leading={<Save className="size-4" />}
                  disabled={isSaving}
                  onClick={() => saveGame(false)}
                >
                  {isSaving ? "Saving" : "Save private"}
                </Button>
                <Button
                  variant="primary"
                  leading={isSaving ? <LoaderCircle className="size-4 animate-spin" /> : <Globe2 className="size-4" />}
                  disabled={isSaving}
                  onClick={() => saveGame(true)}
                >
                  {gameId ? "Publish update" : "Publish"}
                </Button>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <label className="space-y-2 text-sm text-slate-300">
                <span className="block text-xs uppercase tracking-[0.18em] text-slate-400">
                  Prompt
                </span>
                <textarea
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  className="min-h-36 w-full rounded-[24px] border border-white/10 bg-white/6 px-4 py-4 text-sm leading-7 text-white outline-none ring-0 transition focus:border-cyan-300/30"
                  placeholder="Describe the game you want to generate."
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-300">
                  <span className="block text-xs uppercase tracking-[0.18em] text-slate-400">
                    Title
                  </span>
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="h-12 w-full rounded-full border border-white/10 bg-white/6 px-4 text-white outline-none transition focus:border-cyan-300/30"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  <span className="block text-xs uppercase tracking-[0.18em] text-slate-400">
                    Description
                  </span>
                  <input
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    className="h-12 w-full rounded-full border border-white/10 bg-white/6 px-4 text-white outline-none transition focus:border-cyan-300/30"
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  leading={
                    isGenerating ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                      <Sparkles className="size-4" />
                    )
                  }
                  disabled={isGenerating || isRepairing}
                  onClick={handleGenerate}
                >
                  Generate build
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
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
                    runtimeMessages.every((message) => message.type === "ready")
                  }
                  onClick={handleRepair}
                >
                  Fix with AI
                </Button>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/4 p-4 text-sm leading-7 text-slate-300">
                {statusLine}
              </div>
              {requestError ? (
                <div className="rounded-[24px] border border-rose-300/20 bg-rose-500/10 p-4 text-sm text-rose-100">
                  {requestError}
                </div>
              ) : null}
            </div>
          </Panel>

          <Panel className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Refined brief
                </p>
                <h2 className="mt-2 font-display text-2xl uppercase tracking-[0.08em] text-white">
                  AI-ready design notes
                </h2>
              </div>
              {slug ? (
                <Badge className="text-emerald-100">
                  <CheckCircle2 className="size-3.5" />
                  Saved
                </Badge>
              ) : null}
            </div>

            {refinement ? (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="space-y-4 rounded-[24px] border border-white/10 bg-white/4 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Gameplay loop
                  </p>
                  <ul className="space-y-2 text-sm text-slate-200">
                    {refinement.gameplayLoop.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4 rounded-[24px] border border-white/10 bg-white/4 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Style and constraints
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[...refinement.visualStyle, ...refinement.constraints].map((item) => (
                      <Badge key={item} className="border-white/8 text-slate-200 normal-case tracking-normal">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="rounded-[24px] border border-cyan-300/14 bg-cyan-400/5 p-4 md:col-span-2">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">
                    Refined prompt
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-100">
                    {refinement.refinedPrompt}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-[24px] border border-dashed border-white/10 p-5 text-sm text-slate-400">
                Generate a build to see the structured brief that drives the HTML, CSS, and JavaScript output.
              </div>
            )}
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel className="overflow-hidden p-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Badge
                    className={cn(
                      previewState === "error"
                        ? "text-rose-100"
                        : previewState === "ready"
                          ? "text-emerald-100"
                          : "text-cyan-200",
                    )}
                  >
                    {previewState === "error" ? (
                      <AlertTriangle className="size-3.5" />
                    ) : previewState === "ready" ? (
                      <Play className="size-3.5" />
                    ) : (
                      <LoaderCircle className="size-3.5 animate-spin" />
                    )}
                    {previewState === "error"
                      ? "Runtime fault"
                      : previewState === "ready"
                        ? "Preview live"
                        : "Preview syncing"}
                  </Badge>
                  <Badge className="text-slate-300">
                    <Shield className="size-3.5" />
                    Sandboxed iframe
                  </Badge>
                </div>
                <h2 className="font-display text-2xl uppercase tracking-[0.08em] text-white">
                  Isolated execution preview
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {shareUrl ? <ShareLinkButton href={shareUrl} /> : null}
                {slug ? (
                  <Button asChild variant="secondary" leading={<ArrowUpRight className="size-4" />}>
                    <Link href={`/play/${slug}`}>Open public page</Link>
                  </Button>
                ) : null}
              </div>
            </div>

            <GamePreview
              srcDoc={previewDocument}
              title={`${title} live preview`}
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

          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <Panel className="p-5">
              <div className="flex flex-wrap gap-3">
                {(["html", "css", "javascript"] as const).map((tab) => (
                  <button
                    key={tab}
                    className={cn(
                      "rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] transition",
                      activeTab === tab
                        ? tabStyles[tab]
                        : "border-white/10 bg-white/4 text-slate-400 hover:text-white",
                    )}
                    onClick={() => setActiveTab(tab)}
                    type="button"
                  >
                    {tab === "javascript" ? "JS" : tab.toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="mt-5">
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
              </div>
            </Panel>

            <Panel className="p-5">
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Runtime console
                  </p>
                  <h2 className="mt-2 font-display text-2xl uppercase tracking-[0.08em] text-white">
                    Fault trace
                  </h2>
                </div>
                <div className="space-y-3">
                  {runtimeMessages.length ? (
                    runtimeMessages.map((message, index) => (
                      <div
                        key={`${message.type}-${message.message ?? index}-${index}`}
                        className="rounded-[22px] border border-white/8 bg-white/4 p-4 text-sm text-slate-200"
                      >
                        <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                          <Code2 className="size-3.5" />
                          {message.type.replace("-", " ")}
                        </div>
                        <p className="leading-7 text-slate-100">
                          {message.message ?? "Preview updated."}
                        </p>
                        {message.stack ? (
                          <pre className="mt-3 overflow-x-auto rounded-2xl border border-white/6 bg-[#070b18] p-3 text-xs text-slate-400">
                            {message.stack}
                          </pre>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[22px] border border-dashed border-white/10 p-5 text-sm leading-7 text-slate-400">
                      No runtime faults yet. Generate or edit code, then the sandbox will post errors back here automatically.
                    </div>
                  )}
                </div>

                <div className="rounded-[22px] border border-white/8 bg-white/4 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    How to play
                  </p>
                  <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-200">
                    {howToPlay.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}
