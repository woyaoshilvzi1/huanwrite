export function readText(row: Record<string, unknown>, key: string): string {
  const value = row[key];
  if (typeof value !== "string") throw new Error(`sqlite column ${key} must be text`);
  return value;
}

export function readOptionalText(row: Record<string, unknown>, key: string): string | undefined {
  const value = row[key];
  if (value === null || value === undefined) return undefined;
  if (typeof value !== "string") throw new Error(`sqlite column ${key} must be text or null`);
  return value;
}

export function readInteger(row: Record<string, unknown>, key: string): number {
  const value = row[key];
  if (typeof value !== "number" || !Number.isInteger(value)) throw new Error(`sqlite column ${key} must be integer`);
  return value;
}

export function readStringArray(row: Record<string, unknown>, key: string): string[] {
  const value = JSON.parse(readText(row, key));
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`sqlite column ${key} must encode string array`);
  }
  return value;
}
