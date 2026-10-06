/**
 * Normalizes whatever a visitor typed into a bare domain: strips protocol, path, port and "www.",
 * lowercases, converts internationalized names to ASCII, then validates the shape. Returns null if invalid.
 */
export function normalizeDomain(input: string): string | null {
  const raw = input.trim().toLowerCase().replace(/^[a-z]+:\/\//, "").replace(/^www\./, "").split(/[/?#:]/)[0] ?? "";
  if (!raw || raw.length > 253) return null;
  let ascii: string;
  try {
    ascii = new URL(`http://${raw}`).hostname;
  } catch {
    return null;
  }
  const valid = /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/.test(ascii);
  return valid ? ascii : null;
}
