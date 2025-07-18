export function pickAllowedKeys(obj: any, allowed: string[]) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => allowed.includes(key)),
  );
}
