import "server-only";

import { generateObject } from "ai";

import { hasAiGatewayConfig, serverEnv } from "@/lib/env";
import { starterBundle } from "@/lib/starter-game";
import type { CodeBundle, PromptRefinement } from "@/lib/types";

type JsonRecord = Record<string, unknown>;

const defaultGameplayLoop = [
  "Dodge incoming hazards across a compact arena.",
  "Collect energy shards to build score and momentum.",
  "Survive escalating waves long enough to set a new record.",
];

const defaultVisualStyle = [
  "neon arena",
  "glowing hazards",
  "high-contrast HUD",
];
const defaultConstraints = [
  "single screen layout",
  "keyboard and touch friendly",
  "no external assets",
];
const defaultHowToPlay = [
  "Move around the arena to dodge hazards.",
  "Collect energy shards to raise your score.",
  "Stay alive as long as possible to set a high score.",
];

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

async function generateJsonObject(input: { system: string; prompt: string }) {
  const result = await generateObject({
    model: getModel(),
    output: "no-schema",
    system: `${input.system}

Return exactly one valid JSON object.
Do not wrap the JSON in markdown.
Do not add commentary before or after the JSON.`,
    prompt: input.prompt,
    experimental_repairText: async ({ text }) => repairJsonText(text),
  });

  const record = asRecord(result.object);

  if (!record) {
    throw new Error("AI generation did not return a JSON object.");
  }

  return record;
}

function repairJsonText(text: string) {
  const trimmed = text.trim();
  const candidates = new Set<string>([trimmed]);
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);

  if (fenced?.[1]) {
    candidates.add(fenced[1].trim());
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    candidates.add(trimmed.slice(firstBrace, lastBrace + 1).trim());
  }

  for (const candidate of candidates) {
    try {
      JSON.parse(candidate);
      return candidate;
    } catch {
      // Continue trying cleaner JSON candidates.
    }
  }

  return null;
}

function asRecord(value: unknown): JsonRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as JsonRecord;
}

function asString(value: unknown) {
  return typeof value === "string" ? value : null;
}

function asStringArray(value: unknown): string[] {
  if (typeof value === "string") {
    const normalized = value.replace(/\s+/g, " ").trim();
    return normalized ? [normalized] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      if (typeof item === "string") {
        const normalized = item.replace(/\s+/g, " ").trim();
        return normalized ? [normalized] : [];
      }

      const nested = asRecord(item);
      return nested ? flattenStringValues(nested) : [];
    });
  }

  const record = asRecord(value);
  return record ? flattenStringValues(record) : [];
}

function flattenStringValues(record: JsonRecord): string[] {
  return Object.values(record).flatMap((value) => {
    if (typeof value === "string") {
      const normalized = value.replace(/\s+/g, " ").trim();
      return normalized ? [normalized] : [];
    }

    if (Array.isArray(value)) {
      return value.flatMap((item) => {
        if (typeof item === "string") {
          const normalized = item.replace(/\s+/g, " ").trim();
          return normalized ? [normalized] : [];
        }

        const nested = asRecord(item);
        return nested ? flattenStringValues(nested) : [];
      });
    }

    const nested = asRecord(value);
    return nested ? flattenStringValues(nested) : [];
  });
}

function pickFirstString(...values: unknown[]) {
  for (const value of values) {
    const stringValue = asString(value);

    if (stringValue?.trim()) {
      return stringValue;
    }
  }

  return null;
}

function normalizeText(
  value: string | null,
  fallback: string,
  maxLength: number,
) {
  const normalized = value?.replace(/\s+/g, " ").trim() || fallback;
  return normalized.slice(0, maxLength).trim();
}

function normalizeList(
  value: string[],
  fallback: string[],
  minLength: number,
  maxLength: number,
) {
  const normalized = value
    .map((item) => item.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, maxLength);

  if (!normalized.length) {
    normalized.push(...fallback.slice(0, maxLength));
  }

  while (normalized.length < minLength) {
    normalized.push(fallback[normalized.length % fallback.length]);
  }

  return normalized.slice(0, maxLength);
}

function buildRefinedPrompt(input: {
  prompt: string;
  title: string;
  description: string;
  gameplayLoop: string[];
  visualStyle: string[];
  constraints: string[];
}) {
  return `Build a browser game called ${input.title}. ${input.description}

Gameplay loop:
${input.gameplayLoop.map((item) => `- ${item}`).join("\n")}

Visual style:
${input.visualStyle.map((item) => `- ${item}`).join("\n")}

Constraints:
${input.constraints.map((item) => `- ${item}`).join("\n")}

Original prompt:
${input.prompt}`;
}

function normalizeBundle(bundle: CodeBundle) {
  return {
    html: bundle.html.trim() || starterBundle.html,
    css: bundle.css.trim() || starterBundle.css,
    js: bundle.js.trim() || starterBundle.js,
  };
}

function normalizePromptRefinement(
  raw: JsonRecord,
  prompt: string,
): PromptRefinement {
  const title = normalizeText(
    pickFirstString(raw.title, raw.name),
    "Arcade Pulse",
    60,
  );
  const description = normalizeText(
    pickFirstString(raw.description, raw.summary),
    "A fast browser arcade game generated from your studio prompt.",
    220,
  );
  const gameplayLoop = normalizeList(
    [
      ...asStringArray(raw.gameplayLoop),
      ...asStringArray(raw.coreMechanics),
      ...asStringArray(raw.mvpFeatures),
    ],
    defaultGameplayLoop,
    3,
    6,
  );
  const visualStyle = normalizeList(
    asStringArray(raw.visualStyle),
    defaultVisualStyle,
    3,
    6,
  );
  const constraints = normalizeList(
    [
      ...asStringArray(raw.constraints),
      ...asStringArray(raw.technicalScope),
      ...asStringArray(raw.uiElements),
    ],
    defaultConstraints,
    3,
    8,
  );
  const fallbackPrompt = buildRefinedPrompt({
    prompt,
    title,
    description,
    gameplayLoop,
    visualStyle,
    constraints,
  });

  return {
    title,
    description,
    gameplayLoop,
    visualStyle,
    constraints,
    refinedPrompt:
      pickFirstString(raw.refinedPrompt, raw.prompt)?.trim() || fallbackPrompt,
  };
}

function normalizeGeneratedGame(raw: JsonRecord, refinement: PromptRefinement) {
  const code = asRecord(raw.code) ?? asRecord(raw.bundle);
  const html = pickFirstString(
    raw.html,
    raw.htmlCode,
    raw.markup,
    code?.html,
    code?.htmlCode,
  );
  const css = pickFirstString(
    raw.css,
    raw.cssCode,
    raw.styles,
    code?.css,
    code?.cssCode,
  );
  const js = pickFirstString(
    raw.js,
    raw.javascript,
    raw.jsCode,
    raw.script,
    code?.js,
    code?.javascript,
    code?.jsCode,
  );

  if (!html || !css || !js) {
    throw new Error(
      "AI returned JSON, but it did not include complete game code. Configure a more capable AI_GAME_MODEL.",
    );
  }

  return {
    title: normalizeText(
      pickFirstString(raw.title, raw.name),
      refinement.title,
      60,
    ),
    description: normalizeText(
      pickFirstString(raw.description, raw.summary),
      refinement.description,
      220,
    ),
    html: html.trim() || starterBundle.html,
    css: css.trim() || starterBundle.css,
    js: js.trim() || starterBundle.js,
    howToPlay: normalizeList(
      [...asStringArray(raw.howToPlay), ...asStringArray(raw.instructions)],
      defaultHowToPlay,
      3,
      6,
    ),
  };
}

function normalizeRepairResult(raw: JsonRecord, bundle: CodeBundle) {
  const code = asRecord(raw.code) ?? asRecord(raw.bundle);

  return {
    summary: normalizeText(
      pickFirstString(raw.summary, raw.description),
      "Patched the runtime issue while keeping the original game loop intact.",
      180,
    ),
    html: (
      pickFirstString(
        raw.html,
        raw.htmlCode,
        raw.markup,
        code?.html,
        code?.htmlCode,
      ) ?? bundle.html
    ).trim(),
    css: (
      pickFirstString(
        raw.css,
        raw.cssCode,
        raw.styles,
        code?.css,
        code?.cssCode,
      ) ?? bundle.css
    ).trim(),
    js: (
      pickFirstString(
        raw.js,
        raw.javascript,
        raw.jsCode,
        raw.script,
        code?.js,
        code?.javascript,
        code?.jsCode,
      ) ?? bundle.js
    ).trim(),
  };
}

export async function refinePrompt(prompt: string) {
  ensureAiConfigured();

  const refinement = await generateJsonObject({
    system: `You refine natural-language prompts into clear browser game briefs.

Return concise, production-oriented output for a simple single-screen HTML/CSS/JavaScript browser game.
Assume the game must run in a sandboxed iframe with no external libraries or remote assets.
Keep the scope MVP-sized and fun.

Use these exact JSON keys when possible:
- title
- description
- gameplayLoop
- visualStyle
- constraints
- refinedPrompt`,
    prompt: `Refine this game request for an AI game generator:

${prompt}`,
  });

  return normalizePromptRefinement(refinement, prompt);
}

export async function generateGameFromPrompt(prompt: string) {
  const refinement = await refinePrompt(prompt);

  const game = await generateJsonObject({
    system: `You are an expert browser game developer creating MVP games that are fun, polished, and immediately playable.

OUTPUT FORMAT:
Return a JSON object with these exact keys:
{
  "title": "Game Name",
  "description": "Short description (1-2 sentences)",
  "html": "HTML body markup only - NO <html>, <head>, <body>, <script>, or <style> tags",
  "css": "CSS styles only",
  "js": "JavaScript code only - self-contained game logic",
  "howToPlay": ["Control/instruction 1", "Control/instruction 2", "Control/instruction 3"]
}

CRITICAL RULES:
1. SINGLE-SCREEN GAMEPLAY only - no scrolling, no multiple screens
2. NO external libraries, frameworks, CDNs, or remote assets
3. KEYBOARD AND TOUCH controls - must work on desktop AND mobile
4. Clear SCORE or PROGRESSION system with visible feedback
5. WIN/LOSE CONDITIONS - game must be winnable or have game over
6. RESPONSIVE - adapts to different screen sizes
7. NO SYNTAX ERRORS - all variables defined, proper JS syntax
8. IMMEDIATE PLAYABILITY - works the moment it loads

VISUAL QUALITY:
- Modern, polished aesthetics with gradients or neon effects
- Smooth animations using requestAnimationFrame
- High contrast for readability (dark background, bright elements)
- Satisfying visual feedback (particles, flashes, color changes)
- Clean, minimalist HUD with score and instructions
- Professional appearance, not bare-bones

CODE ARCHITECTURE:
- Use requestAnimationFrame for game loop (NOT setInterval)
- Proper event listeners for keyboard (keydown/keyup) and touch
- Track game state in a single state object
- Collision detection for interactions
- Clean separation: update() for logic, draw() for rendering
- Comment complex logic briefly
- No global variable pollution - use IIFE or module pattern
- Handle edge cases (boundaries, undefined values)

GAME DESIGN:
- Easy to learn, hard to master
- Progressive difficulty (speed increases, more obstacles, etc.)
- Instant restart capability
- Score tracking with visual feedback
- Clear objectives communicated upfront

HTML STRUCTURE:
- Use semantic elements (main, div with classes)
- Game container with fixed aspect ratio or responsive sizing
- HUD overlay for score, lives, timer
- Canvas OR DOM elements for game objects
- Keep HTML minimal - style with CSS, logic with JS

CSS STYLING:
- Dark background (#050816 or similar)
- Neon/gradient accents (cyan #4DE2FF, pink #FF5FD2, amber #FFBE5C)
- Smooth transitions and animations
- Centered game area with max-width
- Touch-friendly sizing (min 44px for interactive elements)
- Box shadows for glow effects

JAVASCRIPT LOGIC:
- Initialize on DOMContentLoaded
- Game loop: handle input → update state → check collisions → render
- Keyboard: track pressed keys in Set, check in game loop
- Touch: add touchstart/touchmove/touchend listeners
- Boundary checking to keep objects on screen
- Score increments with visual feedback
- Game over condition with restart option

TESTING CHECKLIST (self-verify before outputting):
✓ Game starts immediately without user action
✓ Controls respond to keyboard AND touch
✓ Score/progression visible and updating
✓ Game can end (win/lose/timeout)
✓ No undefined variables or syntax errors
✓ Objects stay within screen boundaries
✓ Collision detection works
✓ Visual feedback for all interactions
✓ Responsive to screen size changes`,
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
${refinement.refinedPrompt}

Create a COMPLETE, PLAYABLE game with all code included. No placeholders, no TODOs, no incomplete features.`,
  });

  return {
    refinement,
    game: normalizeGeneratedGame(game, refinement),
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
  const repairedGame = await generateJsonObject({
    system: `You are a debugging expert fixing runtime errors in browser games.

Your task:
1. Analyze the runtime error message
2. Identify the root cause in the code
3. Fix ONLY the error - do not redesign or change gameplay
4. Return the corrected complete code

OUTPUT FORMAT:
{
  "summary": "Brief description of what was fixed (1 sentence)",
  "html": "corrected HTML",
  "css": "corrected CSS",
  "js": "corrected JavaScript"
}

FIXING RULES:
- Fix ONLY the reported error, don't redesign the game
- Maintain original gameplay mechanics and visuals
- Add error prevention where possible (null checks, boundary checks)
- Explain what went wrong in the summary
- Return COMPLETE code, not just the changed parts
- Test the fix mentally before returning
- Common fixes: undefined variables, missing event listeners, DOM timing issues
- Use optional chaining (?.) and nullish coalescing (??) for safety
- Add try-catch around risky operations if needed
- Ensure all variables are declared before use
- Check DOM elements exist before accessing properties

ERROR TYPES:
- "runtime-error": JavaScript execution error with stack trace
- "console-error": Error logged to console
- Both indicate something is broken and needs fixing

DEBUGGING APPROACH:
1. Read the error message and stack trace
2. Find the problematic line in the code
3. Determine why it failed (undefined, null, timing, scope, etc.)
4. Apply minimal fix that resolves the issue
5. Verify fix doesn't break other functionality
6. Return complete corrected code`,
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
${current.js}

Return the COMPLETE fixed code with the error resolved.`,
  });

  return normalizeRepairResult(repairedGame, current);
}

function getImageModel() {
  return serverEnv.aiImageModel;
}

export async function generateGameCoverImage(prompt: string) {
  ensureAiConfigured();

  const enhancedPrompt = `Create a vibrant, eye-catching game cover/thumbnail image for a browser game. The image should be in a modern, polished style with neon colors and dynamic composition. Game: "${prompt}". Make it look professional and appealing to players.`;

  const apiKey = serverEnv.aiGatewayApiKey;
  const model = getImageModel();

  const response = await fetch(
    "https://gateway.ai.cloudflare.com/v1/openai/images/generations",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        prompt: enhancedPrompt,
        n: 1,
        size: "512x512",
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to generate cover image: ${response.statusText}`);
  }

  const data = (await response.json()) as {
    data?: Array<{
      b64_json?: string;
      url?: string;
    }>;
  };

  if (!data.data?.[0]) {
    throw new Error("No image data returned from AI model");
  }

  const imageData = data.data[0];

  if (imageData.b64_json) {
    return `data:image/png;base64,${imageData.b64_json}`;
  }

  if (imageData.url) {
    const urlResponse = await fetch(imageData.url);
    const buffer = await urlResponse.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:image/png;base64,${base64}`;
  }

  throw new Error("No image data in response");
}
