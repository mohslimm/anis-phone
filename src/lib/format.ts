/**
 * Formats a number as a DZD price string.
 * Uses a fixed locale ('fr-DZ') to ensure server and client render
 * the exact same string, preventing React hydration mismatches.
 *
 * ✅ "290 000 DZD"  — consistent between SSR and client
 * ❌ toLocaleString() — locale changes between server (Node) and browser
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-DZ").format(amount);
}
