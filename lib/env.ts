import "server-only";

type ServerEnv = {
  BETTER_AUTH_SECRET?: string;
  BETTER_AUTH_URL?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  AI_GATEWAY_API_KEY?: string;
  AI_GAME_MODEL?: string;
  DATABASE_URL?: string;
};

const env = process.env as ServerEnv;

export const serverEnv = {
  aiGatewayApiKey: env.AI_GATEWAY_API_KEY,
  aiGameModel: env.AI_GAME_MODEL ?? "meituan/longcat-flash-chat",
  authSecret: env.BETTER_AUTH_SECRET,
  authUrl: env.BETTER_AUTH_URL,
  databaseUrl: env.DATABASE_URL,
  googleClientId: env.GOOGLE_CLIENT_ID,
  googleClientSecret: env.GOOGLE_CLIENT_SECRET,
};

export function hasDatabaseConfig() {
  return Boolean(serverEnv.databaseUrl);
}

export function hasAiGatewayConfig() {
  return Boolean(serverEnv.aiGatewayApiKey);
}

export function hasGoogleAuthConfig() {
  return Boolean(serverEnv.googleClientId && serverEnv.googleClientSecret);
}
