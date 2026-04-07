const NON_ALPHANUMERIC = /[^a-z0-9]+/g;
const EDGE_HYPHENS = /(^-|-$)/g;

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(NON_ALPHANUMERIC, "-")
    .replace(EDGE_HYPHENS, "")
    .slice(0, 60);
}

export function buildUniqueSlug(base: string, suffix?: string) {
  const slug = slugify(base) || "untitled-game";

  if (!suffix) {
    return slug;
  }

  return `${slug}-${suffix}`.slice(0, 72);
}

