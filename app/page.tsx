import Link from "next/link";
import { connection } from "next/server";
import {
  ArrowRight,
  Gamepad2,
  Sparkles,
  Zap,
  Code2,
  Shield,
  Globe2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { listPublicGames } from "@/lib/games";
import { getSession } from "@/lib/session";
import { formatRelativeDate, truncate } from "@/lib/utils";

const features = [
  {
    icon: Sparkles,
    title: "Prompt",
    description: "Describe your game idea in plain English",
  },
  {
    icon: Zap,
    title: "Generate",
    description: "AI builds a complete playable game",
  },
  {
    icon: Code2,
    title: "Edit",
    description: "Tweak code or let AI fix errors",
  },
  {
    icon: Globe2,
    title: "Publish",
    description: "Share your game with the world",
  },
];

export default async function HomePage() {
  await connection();

  const [session, publicGames] = await Promise.all([
    getSession(),
    listPublicGames(3),
  ]);
  const primaryHref = session ? "/studio/new" : "/sign-in";
  const primaryLabel = session ? "Open Studio" : "Get Started";

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col px-6 lg:px-8">
      {/* Hero Section */}
      <section className="flex flex-col gap-12 py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left */}
          <div className="space-y-8">
            <div className="space-y-5">
              <Badge className="border-blue-200 bg-blue-50 text-blue-700">
                <Sparkles className="size-3" />
                AI Game Generator
              </Badge>
              <h1 className="font-display text-4xl font-bold uppercase tracking-[0.06em] text-gray-900 md:text-5xl">
                Forge Games From Pure Imagination
              </h1>
              <p className="text-base leading-7 text-gray-500">
                Describe your game idea. Let AI build it. Play, refine, and
                publish all in one studio. No coding required.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                variant="primary"
                size="lg"
                leading={<Sparkles className="size-4" />}
              >
                <Link href={primaryHref}>{primaryLabel}</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="#arcade">
                  Browse Arcade <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
            <div className="flex items-center gap-8 border-t border-gray-200 pt-6 text-sm text-gray-500">
              <div>
                <p className="font-display text-xl font-bold text-gray-900">
                  {publicGames.length * 127}+
                </p>
                <p>Games Created</p>
              </div>
              <div>
                <p className="font-display text-xl font-bold text-gray-900">
                  12k
                </p>
                <p>Active Players</p>
              </div>
              <div>
                <p className="font-display text-xl font-bold text-gray-900">
                  98%
                </p>
                <p>AI Success Rate</p>
              </div>
            </div>
          </div>

          {/* Right - Studio Mockup */}
          <Panel className="overflow-hidden">
            <div className="space-y-4 p-5">
              {/* Top Bar */}
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-red-400" />
                  <div className="h-2 w-2 rounded-full bg-yellow-400" />
                  <div className="h-2 w-2 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-gray-400">Studio</span>
              </div>

              {/* Main Content */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Prompt Panel */}
                <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-blue-600" />
                    <span className="text-xs font-medium text-gray-700">
                      Prompt
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full rounded bg-gray-200" />
                    <div className="h-2 w-3/4 rounded bg-gray-200" />
                    <div className="h-2 w-1/2 rounded bg-gray-200" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-7 flex-1 rounded bg-gray-900" />
                    <div className="h-7 w-14 rounded bg-gray-200" />
                  </div>
                </div>

                {/* Preview Panel */}
                <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-900 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-green-400">
                      ● Ready
                    </span>
                  </div>
                  <div className="aspect-video rounded bg-gray-800" />
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-5 rounded bg-gray-700" />
                    <div className="h-5 rounded bg-gray-700" />
                    <div className="h-5 rounded bg-gray-700" />
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                {["Prompt", "Generate", "Play", "Publish"].map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${i < 2 ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-500"}`}
                    >
                      {i + 1}
                    </div>
                    <span
                      className={`text-xs ${i < 2 ? "text-gray-900" : "text-gray-400"}`}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </div>
      </section>

      {/* Creation Loop */}
      <section className="py-16">
        <div className="space-y-10">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-blue-600">
              The Creation Loop
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-[0.06em] text-gray-900 md:text-4xl">
              How It Works
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Panel key={feature.title} className="group p-5">
                <div className="flex items-start justify-between">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-2.5">
                    <feature.icon className="size-5 text-gray-700" />
                  </div>
                  <span className="font-display text-xl font-bold text-gray-200">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-base uppercase tracking-[0.06em] text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {feature.description}
                </p>
              </Panel>
            ))}
          </div>
        </div>
      </section>

      {/* Arcade */}
      <section id="arcade" className="py-16">
        <div className="space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-blue-600">
                From Our Arcade
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-[0.06em] text-gray-900 md:text-4xl">
                Play What Creators Ship
              </h2>
            </div>
            <Button asChild variant="secondary" size="sm">
              <Link href="/dashboard">
                View all <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          {publicGames.length ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {publicGames.map((game) => (
                <Link
                  key={game.id}
                  href={`/play/${game.slug}`}
                  className="group"
                >
                  <Panel className="h-full overflow-hidden transition hover:border-gray-300">
                    <div className="aspect-video bg-gray-100" />
                    <div className="p-4">
                      <h3 className="font-display text-base uppercase tracking-[0.06em] text-gray-900 group-hover:text-blue-600">
                        {game.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-6 text-gray-500">
                        {truncate(game.description, 80)}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                        <span>{formatRelativeDate(game.updatedAt)}</span>
                        <span>by {game.user.name}</span>
                      </div>
                    </div>
                  </Panel>
                </Link>
              ))}
            </div>
          ) : (
            <Panel className="p-10 text-center">
              <Gamepad2 className="mx-auto size-10 text-gray-300" />
              <p className="mt-3 text-sm leading-7 text-gray-500">
                No public games yet. Be the first to create!
              </p>
              <Button
                asChild
                variant="primary"
                className="mt-5"
                leading={<Sparkles className="size-4" />}
              >
                <Link href="/studio/new">Create Your Game</Link>
              </Button>
            </Panel>
          )}
        </div>
      </section>

      {/* AI Repair */}
      <section className="py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.18em] text-blue-600">
              AI-Powered Debugging
            </p>
            <h2 className="font-display text-3xl font-bold uppercase leading-[1.1] tracking-[0.06em] text-gray-900 md:text-4xl">
              Patch Issues Without Breaking Flow
            </h2>
            <p className="max-w-lg text-base leading-7 text-gray-500">
              When errors appear, don't debug manually. Let AI analyze the issue
              and fix it automatically. Keep creating, not troubleshooting.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                variant="primary"
                size="lg"
                leading={<Shield className="size-4" />}
              >
                <Link href={primaryHref}>Start Building</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="#arcade">
                  See Examples <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <Panel className="p-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                  Error Console
                </span>
                <Badge className="border-red-200 bg-red-50 text-red-700">
                  1 Error
                </Badge>
              </div>

              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <div className="flex items-start gap-3">
                  <div className="rounded bg-red-100 p-1.5">
                    <div className="size-2.5 rounded-full bg-red-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-red-800">
                      TypeError: Cannot read properties of undefined
                    </p>
                    <p className="text-xs text-red-600">
                      at gameLoop (script.js:42)
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <div className="flex items-start gap-3">
                  <div className="rounded bg-blue-100 p-1.5">
                    <Sparkles className="size-3 text-blue-600" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium text-blue-800">
                      AI suggests a fix
                    </p>
                    <p className="text-xs leading-6 text-gray-600">
                      Added null check before accessing game state.
                    </p>
                    <div className="flex gap-2">
                      <div className="h-7 flex-1 rounded bg-blue-600" />
                      <div className="h-7 w-16 rounded bg-gray-200" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="rounded bg-green-100 p-1.5">
                    <div className="size-2.5 rounded-full bg-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Fixed! Game running smoothly
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <Panel className="p-10 text-center">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.18em] text-blue-600">
              Ready to Create?
            </p>
            <h2 className="font-display text-3xl font-bold uppercase tracking-[0.06em] text-gray-900 md:text-4xl">
              Enter The Foundry
            </h2>
            <p className="mx-auto max-w-md text-base leading-7 text-gray-500">
              Your next game idea is waiting. Start building in seconds, no
              experience needed.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                asChild
                variant="primary"
                size="lg"
                leading={<Sparkles className="size-4" />}
              >
                <Link href={primaryHref}>Start Free</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="#arcade">
                  View public games <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Panel>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-gray-900">
              <Gamepad2 className="size-3 text-white" />
            </div>
            <span className="font-medium text-gray-600">Gibe</span>
          </div>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-gray-600">
              Home
            </Link>
            <Link href="/dashboard" className="hover:text-gray-600">
              Dashboard
            </Link>
            <Link href="/studio/new" className="hover:text-gray-600">
              Studio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
