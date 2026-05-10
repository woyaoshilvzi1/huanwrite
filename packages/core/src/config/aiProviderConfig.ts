import { type EnvironmentReader, ProcessEnvironmentReader } from "./environment.js";
import { resolveModelCapabilities, type ModelCapabilities } from "./modelCapabilities.js";

export interface AiProviderConfig {
  id: string;
  apiKey: string;
  baseUrl: string;
  model: string;
  timeoutMs: number;
  thinking?: string;
  reasoningEffort?: string;
  showReasoning: boolean;
  streaming: boolean;
  capabilities: ModelCapabilities;
}

export class AiProviderConfigReader {
  constructor(
    private readonly environment: EnvironmentReader = new ProcessEnvironmentReader()
  ) {}

  readActive(): AiProviderConfig {
    const provider = readRequired(this.environment, "HUANWRITE_PROVIDER");
    const model = readRequired(this.environment, "HUANWRITE_MODEL");
    const thinking = this.environment.read("HUANWRITE_THINKING");
    const reasoningEffort = this.environment.read("HUANWRITE_REASONING_EFFORT");
    return {
      id: provider,
      apiKey: readRequired(this.environment, "HUANWRITE_API_KEY"),
      baseUrl: readRequired(this.environment, "HUANWRITE_BASE_URL"),
      model,
      timeoutMs: Number(readRequired(this.environment, "HUANWRITE_API_TIMEOUT_MS")),
      thinking,
      reasoningEffort,
      showReasoning: readBoolean(this.environment, "HUANWRITE_SHOW_REASONING"),
      streaming: readBoolean(this.environment, "HUANWRITE_STREAMING"),
      capabilities: resolveModelCapabilities({ provider, model, thinking, reasoningEffort })
    };
  }
}

function readRequired(environment: EnvironmentReader, name: string): string {
  const value = environment.read(name);
  if (!value) throw new Error(`missing environment variable: ${name}`);
  return value;
}

function readBoolean(environment: EnvironmentReader, name: string): boolean {
  return environment.read(name) === "true";
}
