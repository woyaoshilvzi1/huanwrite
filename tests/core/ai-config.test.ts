import { describe, expect, it } from "vitest";
import { AiProviderConfigReader, type EnvironmentReader } from "@huanwrite/core";

describe("AI provider config", () => {
  it("reads the active provider only from environment", () => {
    const config = new AiProviderConfigReader(new TestEnvironment()).readActive();
    expect(config).toEqual({
      id: "yls",
      apiKey: "present",
      baseUrl: "https://code.ylsagi.com/codex",
      model: "gpt-5.5",
      timeoutMs: 60000,
      thinking: undefined,
      reasoningEffort: "medium",
      showReasoning: true,
      streaming: true,
      capabilities: {
        provider: "yls",
        model: "gpt-5.5",
        wireApi: "responses",
        supportsReasoningContent: false,
        defaultReasoningEnabled: true,
        normalizedReasoningEffort: "medium"
      }
    });
  });

  it("normalizes deepseek model capabilities", () => {
    const config = new AiProviderConfigReader(new DeepSeekEnvironment()).readActive();
    expect(config.capabilities).toEqual({
      provider: "deepseekv4",
      model: "deepseek-v4-flash",
      wireApi: "chat.completions",
      supportsReasoningContent: true,
      defaultReasoningEnabled: true,
      thinking: "enabled",
      normalizedReasoningEffort: "max"
    });
  });
});

class TestEnvironment implements EnvironmentReader {
  read(name: string): string | undefined {
    if (name === "HUANWRITE_PROVIDER") return "yls";
    if (name === "HUANWRITE_API_KEY") return "present";
    if (name === "HUANWRITE_BASE_URL") return "https://code.ylsagi.com/codex";
    if (name === "HUANWRITE_MODEL") return "gpt-5.5";
    if (name === "HUANWRITE_API_TIMEOUT_MS") return "60000";
    if (name === "HUANWRITE_REASONING_EFFORT") return "medium";
    if (name === "HUANWRITE_SHOW_REASONING") return "true";
    if (name === "HUANWRITE_STREAMING") return "true";
    return undefined;
  }
}

class DeepSeekEnvironment implements EnvironmentReader {
  read(name: string): string | undefined {
    if (name === "HUANWRITE_PROVIDER") return "deepseekv4";
    if (name === "HUANWRITE_API_KEY") return "present";
    if (name === "HUANWRITE_BASE_URL") return "https://api.deepseek.com";
    if (name === "HUANWRITE_MODEL") return "deepseek-v4-flash";
    if (name === "HUANWRITE_API_TIMEOUT_MS") return "60000";
    if (name === "HUANWRITE_THINKING") return "enabled";
    if (name === "HUANWRITE_REASONING_EFFORT") return "max";
    if (name === "HUANWRITE_SHOW_REASONING") return "true";
    if (name === "HUANWRITE_STREAMING") return "true";
    return undefined;
  }
}
