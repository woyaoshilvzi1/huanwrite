export interface ModelCapabilities {
  provider: string;
  model: string;
  wireApi: "responses" | "chat.completions";
  supportsReasoningContent: boolean;
  defaultReasoningEnabled: boolean;
  normalizedReasoningEffort?: "minimal" | "low" | "medium" | "high" | "xhigh" | "max";
  thinking?: "enabled" | "disabled";
}

export interface ModelCapabilityInput {
  provider: string;
  model: string;
  thinking?: string;
  reasoningEffort?: string;
}

export function resolveModelCapabilities(input: ModelCapabilityInput): ModelCapabilities {
  const provider = normalize(input.provider);
  const model = String(input.model).trim();

  if (provider === "deepseekv4" || provider === "deepseek" || model.startsWith("deepseek-")) {
    return {
      provider,
      model,
      wireApi: "chat.completions",
      supportsReasoningContent: true,
      defaultReasoningEnabled: true,
      thinking: normalizeThinking(input.thinking ?? "enabled"),
      normalizedReasoningEffort: normalizeDeepSeekReasoning(input.reasoningEffort)
    };
  }

  return {
    provider,
    model,
    wireApi: "responses",
    supportsReasoningContent: false,
    defaultReasoningEnabled: Boolean(input.reasoningEffort),
    normalizedReasoningEffort: normalizeReasoning(input.reasoningEffort)
  };
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function normalizeThinking(value: string): "enabled" | "disabled" {
  return value === "disabled" ? "disabled" : "enabled";
}

function normalizeReasoning(value: string | undefined): ModelCapabilities["normalizedReasoningEffort"] {
  if (
    value === "minimal" ||
    value === "low" ||
    value === "medium" ||
    value === "high" ||
    value === "xhigh" ||
    value === "max"
  ) {
    return value;
  }
  return undefined;
}

function normalizeDeepSeekReasoning(value: string | undefined): "high" | "max" {
  return value === "xhigh" || value === "max" ? "max" : "high";
}
