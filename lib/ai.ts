import "server-only";

import { generateObject } from "ai";
import { z } from "zod";

import { hasAiGatewayConfig, serverEnv } from "@/lib/env";
import { starterBundle } from "@/lib/starter-game";
import type { CodeBundle, PromptRefinement } from "@/lib/types";

const promptRefinementSchema = z.object({
  title: z.string().min(3).max(60),
  description: z.string().min(12).max(220),
  gameplayLoop: z.array(z.string().min(6)).min(3).max(6),
  visualStyle: z.array(z.string().min(3)).min(3).max(6),
  constraints: z.array(z.string().min(3)).min(3).max(8),
  refinedPrompt: z.string().min(40),
});

const generatedGameSchema = z.object({
  title: z.string().min(3).max(60),
  description: z.string().min(12).max(220),
  html: z.string().min(20),
  css: z.string().min(20),
  js: z.string().min(20),
  howToPlay: z.array(z.string().min(4)).min(3).max(6),
});

const repairSchema = z.object({
  summary: z.string().min(8).max(180),
  html: z.string().min(20),
  css: z.string().min(20),
  js: z.string().min(20),
});

function getModel() {
  return serverEnv.aiGameModel;
}

function ensureAiConfigured() {
  if (!hasAiGatewayConfig()) {
    throw new Error(
      "AI Gateway is not configured. Add AI_GATEWAY_API_KEY and AI_GAME_MODEL to continue.",
    );
  }
}

function normalizeBundle(bundle: CodeBundle) {
  return {
    html: bundle.html.trim() || starterBundle.html,
    css: bundle.css.trim() || starterBundle.css,
    js: bundle.js.trim() || starterBundle.js,
  };
}

export async function refinePrompt(prompt: string) {
  ensureAiConfigured();

  const result = await generateObject({
    model: getModel(),
    schema: promptRefinementSchema,
    system: `You refine natural-language prompts into clear browser game briefs.

Return concise, production-oriented output for a simple single-screen HTML/CSS/JavaScript browser game.
Assume the game must run in a sandboxed iframe with no external libraries or remote assets.
Keep the scope MVP-sized and fun.`,
    prompt: `Refine this game request for an AI game generator:

${prompt}`,
  });

  return result.object;
}

export async function generateGameFromPrompt(prompt: string) {
  const refinement = await refinePrompt(prompt);

  const result = await generateObject({
    model: getModel(),
    schema: generatedGameSchema,
    system: `You generate complete browser games as separate HTML, CSS, and JavaScript strings.

Rules:
- Output HTML body markup only. Do not return <html>, <head>, <body>, <script>, or <style> tags.
- Output CSS only in the css field.
- Output JavaScript only in the js field.
- No external libraries.
- No remote asset dependencies.
- The game must be playable immediately after injection into a sandboxed iframe.
- Include score, win/loss, or progression feedback.
- Prefer a single-screen game that is responsive on desktop and mobile.
- Avoid syntax errors and undefined variables.`,
    prompt: `Build a browser game from this refined brief:

Title: ${refinement.title}
Description: ${refinement.description}
Gameplay loop:
${refinement.gameplayLoop.map((item) => `- ${item}`).join("\n")}

Visual style:
${refinement.visualStyle.map((item) => `- ${item}`).join("\n")}

Constraints:
${refinement.constraints.map((item) => `- ${item}`).join("\n")}

Refined prompt:
${refinement.refinedPrompt}`,
  });

  return {
    refinement,
    game: result.object,
  };
}

export async function repairGameWithAi(input: {
  prompt: string;
  refinement: PromptRefinement;
  bundle: CodeBundle;
  runtimeError: string;
}) {
  ensureAiConfigured();

  const current = normalizeBundle(input.bundle);
  const result = await generateObject({
    model: getModel(),
    schema: repairSchema,
    system: `You repair browser games that failed at runtime.

Return corrected HTML, CSS, and JavaScript fields.
Do not redesign the game unless needed to fix the bug.
Keep the gameplay goal intact.
Assume the code runs in a sandboxed iframe with no external libraries.`,
    prompt: `Fix this game.

Original prompt:
${input.prompt}

Refined prompt:
${input.refinement.refinedPrompt}

Runtime error:
${input.runtimeError}

Current HTML:
${current.html}

Current CSS:
${current.css}

Current JavaScript:
${current.js}`,
  });

  return result.object;
}

