/**
 * Simple template interpolation utility
 * Uses template literals with dynamic function generation
 */
export function interpolate(str, params) {
  const names = Object.keys(params);
  const values = Object.values(params);

  return new Function(...names, `return \`${str}\`;`)(...values);
}
