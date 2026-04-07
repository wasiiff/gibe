import type { CodeBundle, GeneratedGamePayload, PromptRefinement } from "@/lib/types";

export const starterBundle: CodeBundle = {
  html: `
<main class="game-shell">
  <div class="hud">
    <span class="badge">Arrow Keys</span>
    <span class="badge">Collect the cyan orbs</span>
    <span class="score">Score: <strong id="score">0</strong></span>
  </div>
  <div id="arena" class="arena">
    <div id="player" class="player"></div>
    <div id="orb" class="orb"></div>
  </div>
</main>`.trim(),
  css: `
body {
  display: grid;
  place-items: center;
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(77, 226, 255, 0.24), transparent 42%),
    radial-gradient(circle at bottom right, rgba(255, 95, 210, 0.22), transparent 36%),
    #050816;
}

.game-shell {
  width: min(92vw, 840px);
  padding: 20px;
  border: 1px solid rgba(105, 164, 255, 0.26);
  border-radius: 24px;
  background: rgba(8, 12, 26, 0.84);
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.45);
}

.hud {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  color: #cad4f8;
}

.badge,
.score {
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(14, 22, 44, 0.92);
  border: 1px solid rgba(121, 177, 255, 0.28);
}

.arena {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: 20px;
  background:
    linear-gradient(rgba(121, 177, 255, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(121, 177, 255, 0.08) 1px, transparent 1px),
    linear-gradient(180deg, rgba(10, 17, 34, 0.98), rgba(4, 8, 18, 0.98));
  background-size: 48px 48px, 48px 48px, cover;
}

.player,
.orb {
  position: absolute;
  width: 26px;
  height: 26px;
  border-radius: 999px;
}

.player {
  background: linear-gradient(135deg, #7cffc5, #4de2ff);
  box-shadow: 0 0 24px rgba(77, 226, 255, 0.6);
}

.orb {
  background: linear-gradient(135deg, #ffbe5c, #ff5fd2);
  box-shadow: 0 0 24px rgba(255, 95, 210, 0.5);
}
`.trim(),
  js: `
const arena = document.getElementById("arena");
const player = document.getElementById("player");
const orb = document.getElementById("orb");
const scoreNode = document.getElementById("score");

const state = {
  x: 120,
  y: 120,
  speed: 4,
  score: 0,
  keys: new Set(),
};

function randomPosition() {
  return {
    x: Math.random() * (arena.clientWidth - 30),
    y: Math.random() * (arena.clientHeight - 30),
  };
}

function placeOrb() {
  const next = randomPosition();
  orb.style.transform = \`translate(\${next.x}px, \${next.y}px)\`;
  orb.dataset.x = String(next.x);
  orb.dataset.y = String(next.y);
}

function updatePlayer() {
  if (state.keys.has("ArrowLeft")) state.x -= state.speed;
  if (state.keys.has("ArrowRight")) state.x += state.speed;
  if (state.keys.has("ArrowUp")) state.y -= state.speed;
  if (state.keys.has("ArrowDown")) state.y += state.speed;

  state.x = Math.max(0, Math.min(arena.clientWidth - 26, state.x));
  state.y = Math.max(0, Math.min(arena.clientHeight - 26, state.y));

  player.style.transform = \`translate(\${state.x}px, \${state.y}px)\`;
}

function checkCollision() {
  const orbX = Number(orb.dataset.x || 0);
  const orbY = Number(orb.dataset.y || 0);
  const dx = state.x - orbX;
  const dy = state.y - orbY;

  if (Math.hypot(dx, dy) < 28) {
    state.score += 1;
    scoreNode.textContent = String(state.score);
    placeOrb();
  }
}

function tick() {
  updatePlayer();
  checkCollision();
  requestAnimationFrame(tick);
}

window.addEventListener("keydown", (event) => state.keys.add(event.key));
window.addEventListener("keyup", (event) => state.keys.delete(event.key));

placeOrb();
tick();
`.trim(),
};

export const starterRefinement: PromptRefinement = {
  title: "Orb Dash Arena",
  description: "A compact reflex game where the player slides through a neon arena collecting energy orbs.",
  gameplayLoop: [
    "Move the player with the arrow keys.",
    "Collect glowing orbs to increase score.",
    "Stay in motion as the arena updates in real time.",
  ],
  visualStyle: [
    "Dark sci-fi arena",
    "Neon cyan and pink accents",
    "Minimal HUD with arcade badge styling",
  ],
  constraints: [
    "No external assets or libraries",
    "Single-screen browser game",
    "Fast load and responsive layout",
  ],
  refinedPrompt:
    "Create a compact browser game with a neon arena, keyboard controls, one clear score mechanic, and no external libraries.",
};

export const starterGame: GeneratedGamePayload = {
  title: "Orb Dash Arena",
  description:
    "Warm up the studio with a playable neon orb collector while you iterate on your own prompt.",
  ...starterBundle,
  howToPlay: [
    "Use the arrow keys to move the player orb.",
    "Collect the glowing targets to raise your score.",
    "Keep moving and try to chain quick pickups.",
  ],
};

