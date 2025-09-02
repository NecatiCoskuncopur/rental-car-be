/**
 * Picks only the allowed keys from an object and returns a new object.
 *
 * This function filters the given object and keeps only the properties
 * whose keys exist in the `allowed` array.
 *
 * - If `obj` is not a valid object, an empty object is returned.
 * - Keys not listed in `allowed` will be omitted.
 *
 * @param {Record<string, any>} obj - The source object to filter.
 * @param {string[]} allowed - The list of allowed keys to keep.
 * @returns {Record<string, any>} A new object containing only the allowed keys.
 */

export function pickAllowedKeys(obj: any, allowed: string[]) {
  if (!obj || typeof obj !== 'object') return {};
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => allowed.includes(key)),
  );
}
