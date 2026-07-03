/** Tiny classnames helper — no need for a dependency at this scale. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
