import "server-only";

type RateLimitStore = {
  [key: string]: {
    count: number;
    resetAt: number;
  };
};

const store: RateLimitStore = {};

const CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutes
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();

  if (now - lastCleanup < CLEANUP_INTERVAL) {
    return;
  }

  lastCleanup = now;

  for (const key of Object.keys(store)) {
    if (store[key]!.resetAt < now) {
      delete store[key];
    }
  }
}

type RateLimitOptions = {
  max: number;
  windowMs: number;
};

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

export async function rateLimit(
  identifier: string,
  options: RateLimitOptions = { max: 10, windowMs: 60 * 1000 },
): Promise<RateLimitResult> {
  cleanup();

  const now = Date.now();
  const key = `ratelimit:${identifier}`;
  const existing = store[key];

  if (!existing || existing.resetAt < now) {
    store[key] = {
      count: 1,
      resetAt: now + options.windowMs,
    };

    return {
      success: true,
      limit: options.max,
      remaining: options.max - 1,
      reset: now + options.windowMs,
    };
  }

  existing.count += 1;

  if (existing.count > options.max) {
    return {
      success: false,
      limit: options.max,
      remaining: 0,
      reset: existing.resetAt,
    };
  }

  return {
    success: true,
    limit: options.max,
    remaining: options.max - existing.count,
    reset: existing.resetAt,
  };
}

export function getRateLimitHeaders(result: RateLimitResult): HeadersInit {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(result.reset),
  };
}
