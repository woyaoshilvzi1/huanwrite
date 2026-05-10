const secretPatterns = [/\bsk-[A-Za-z0-9_-]{8,}/, /\b(api[_-]?key|cookie|password|passwd|secret)\b/i];

export function assertNoSensitiveText(value: unknown): void {
  if (typeof value === "string") {
    if (secretPatterns.some((pattern) => pattern.test(value))) {
      throw new Error("sensitive information is not allowed in project records");
    }
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) assertNoSensitiveText(item);
    return;
  }
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) assertNoSensitiveText(item);
  }
}

