import Link from "next/link";
import { connection } from "next/server";
import {
  Bug,
  CodeXml,
  Gamepad2,
  Globe2,
  PlayCircle,
  Sparkles,
} from "lucide-react";

import { PipelineGraphic } from "@/components/brand/pipeline-graphic";
import { GameCard } from "@/components/game/game-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { SectionHeading } from "@/components/ui/section-heading";
import { listPublicGames } from "@/lib/games";
import { getSession } from "@/lib/session";

const features = [
  {
    icon: Sparkles,
    title: "Prompt to playable",
    description:
      "Turn a natural-language idea into a complete HTML, CSS, and JavaScript game build in one generation loop.",
  },
  {
    icon: Bug,
    title: "Debug with AI",
    description:
      "Capture runtime faults from the sandboxed preview, then route the error and source back through an automated repair pass.",
  },
  {
    icon: Globe2,
    title: "Ship a live link",
    description:
      "Save private drafts, publish public arcade pages, and share a playable URL with metadata and creator attribution.",
  },
];

export default async function HomePage() {
  await connection();

  const [session, publicGames] = await Promise.all([getSession(), listPublicGames(6)]);
  const primaryHref = session ? "/studio/new" : "/sign-in";
  const primaryLabel = session ? "Open studio" : "Launch Gibe";

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-24 px-6 py-12 lg:px-8 lg:py-16">
      <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-8">
          <Badge className="text-cyan-200">
            <Gamepad2 className="size-3.5" />
            AI game generation platform
          </Badge>
          <div className="space-y-5">
            <h1 className="font-display text-5xl uppercase leading-none tracking-[0.08em] text-white md:text-6xl xl:text-7xl">
              Prompt.
              <br />
              Generate.
              <br />
              Patch.
              <br />
              Publish.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
              Gibe is a full-stack game forge for fast browser prototypes. Describe
              the game, let AI build the code, inspect the sandboxed preview, repair
              runtime faults, then ship a live arcade link from the same workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button asChild variant="primary" size="lg" leading={<Sparkles className="size-4" />}>
              <Link href={primaryHref}>{primaryLabel}</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" leading={<PlayCircle className="size-4" />}>
              <Link href="/dashboard">View dashboard</Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Refinement layer", "Natural prompts become structured playable briefs."],
              ["Live sandbox", "Auto-refresh preview with isolated runtime execution."],
              ["Publishing", "Public links with creator metadata and replay support."],
            ].map(([title, copy]) => (
              <Panel key={title} className="p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">{title}</p>
                <p className="mt-3 text-sm leading-7 text-slate-300">{copy}</p>
              </Panel>
            ))}
          </div>
        </div>
        <Panel className="overflow-hidden p-5">
          <PipelineGraphic className="w-full" />
        </Panel>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Core Loop"
          title="Built for the whole iteration cycle"
          description="The MVP covers prompt refinement, code generation, isolated execution, AI repair, manual editing, and publishing without leaving the studio."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {features.map((feature) => (
            <Panel key={feature.title} className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="rounded-3xl border border-white/10 bg-white/6 p-4">
                  <feature.icon className="size-6 text-cyan-200" />
                </div>
                <Badge>{feature.title}</Badge>
              </div>
              <h3 className="mt-5 font-display text-2xl uppercase tracking-[0.08em] text-white">
                {feature.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">{feature.description}</p>
            </Panel>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Live Arcade"
          title="Public games already in rotation"
          description="Published builds show up here automatically with playable routes and creator metadata."
          action={
            <Button asChild variant="secondary" leading={<CodeXml className="size-4" />}>
              <Link href="/studio/new">Start a new build</Link>
            </Button>
          }
        />
        {publicGames.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {publicGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                creatorName={game.user.name}
                mode="public"
              />
            ))}
          </div>
        ) : (
          <Panel className="p-8 text-sm leading-7 text-slate-300">
            No public builds are published yet. Save a game and flip it live from the
            studio to populate this arcade rail.
          </Panel>
        )}
      </section>
    </div>
  );
}
