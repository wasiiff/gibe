export type CodeBundle = {
  html: string;
  css: string;
  js: string;
};

export type RuntimeMessage = {
  type: "ready" | "runtime-error" | "console-error";
  message?: string;
  stack?: string | null;
  filename?: string;
  lineno?: number;
  colno?: number;
};

export type PromptRefinement = {
  title: string;
  description: string;
  gameplayLoop: string[];
  visualStyle: string[];
  constraints: string[];
  refinedPrompt: string;
};

export type GeneratedGamePayload = {
  title: string;
  description: string;
  html: string;
  css: string;
  js: string;
  howToPlay: string[];
};

