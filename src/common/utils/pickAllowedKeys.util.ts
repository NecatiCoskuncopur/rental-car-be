export function pickAllowedKeys(obj: any, allowed: string[]) {
  if (!obj || typeof obj !== 'object') return {};
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => allowed.includes(key)),
  );
}
