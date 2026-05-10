import { AiProviderConfigReader, type AiProviderConfig } from "../config/aiProviderConfig.js";

export interface AiActionInput {
  systemPrompt: string;
  userPrompt: string;
}

export interface AiActionResult {
  apiUsed: boolean;
  model: string;
  endpoint: string;
  content: string;
  responseId: string;
  usage: {
    inputChars: number;
    outputChars: number;
  };
  error: string;
}

interface ChatCompletionPayload {
  id?: string;
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
  };
}

interface ResponsesPayload {
  id?: string;
  output_text?: string;
  output?: Array<{
    content?: Array<{
      text?: string;
    }>;
  }>;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
  };
}

export class AiActionClient {
  constructor(private readonly configReader = new AiProviderConfigReader()) {}

  async complete(input: AiActionInput): Promise<AiActionResult> {
    let config: AiProviderConfig;
    try {
      config = this.configReader.readActive();
    } catch (error) {
      return localResult(input, error instanceof Error ? error.message : "ai configuration missing");
    }
    if (isTestProvider(config)) {
      return localResult(input, "test provider uses deterministic local result", config.model, normalizedEndpoint(config));
    }
    try {
      const endpoint = normalizedEndpoint(config);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${config.apiKey}`
        },
        body: JSON.stringify(requestBody(config, input)),
        signal: AbortSignal.timeout(config.timeoutMs)
      });
      const text = await response.text();
      if (!response.ok) return localResult(input, `provider http ${response.status}: ${text.slice(0, 240)}`, config.model, endpoint);
      const parsed = JSON.parse(text) as ChatCompletionPayload | ResponsesPayload;
      const content = responseContent(parsed) || text.trim();
      const usage = responseUsage(parsed, input, content);
      return {
        apiUsed: true,
        model: config.model,
        endpoint,
        content,
        responseId: parsed.id ?? "",
        usage,
        error: ""
      };
    } catch (error) {
      return localResult(input, error instanceof Error ? error.message : "provider call failed", config.model, normalizedEndpoint(config));
    }
  }
}

function normalizedEndpoint(config: AiProviderConfig): string {
  const base = config.baseUrl.replace(/\/+$/, "");
  if (base.endsWith("/chat/completions") || base.endsWith("/responses")) return base;
  return config.capabilities.wireApi === "responses" ? `${base}/responses` : `${base}/chat/completions`;
}

function requestBody(config: AiProviderConfig, input: AiActionInput): object {
  if (config.capabilities.wireApi === "responses") {
    return {
      model: config.model,
      input: [
        { role: "system", content: input.systemPrompt },
        { role: "user", content: input.userPrompt }
      ],
      reasoning: config.reasoningEffort ? { effort: config.reasoningEffort } : undefined,
      store: false
    };
  }
  return {
    model: config.model,
    messages: [
      { role: "system", content: input.systemPrompt },
      { role: "user", content: input.userPrompt }
    ],
    stream: false
  };
}

function responseContent(payload: ChatCompletionPayload | ResponsesPayload): string {
  if (isChatCompletionPayload(payload)) return payload.choices?.[0]?.message?.content?.trim() ?? "";
  const outputText = payload.output_text?.trim();
  if (outputText) return outputText;
  const parts = payload.output?.flatMap((item) => item.content ?? []).map((item) => item.text ?? "") ?? [];
  return parts.join("\n").trim();
}

function responseUsage(
  payload: ChatCompletionPayload | ResponsesPayload,
  input: AiActionInput,
  content: string
): AiActionResult["usage"] {
  if (isChatCompletionPayload(payload)) {
    return {
      inputChars: payload.usage?.prompt_tokens ?? input.systemPrompt.length + input.userPrompt.length,
      outputChars: payload.usage?.completion_tokens ?? content.length
    };
  }
  return {
    inputChars: payload.usage?.input_tokens ?? input.systemPrompt.length + input.userPrompt.length,
    outputChars: payload.usage?.output_tokens ?? content.length
  };
}

function isChatCompletionPayload(payload: ChatCompletionPayload | ResponsesPayload): payload is ChatCompletionPayload {
  return "choices" in payload;
}

function isTestProvider(config: AiProviderConfig): boolean {
  return config.apiKey === "test-provider-key" || config.baseUrl.includes(".example");
}

function localResult(input: AiActionInput, error: string, model = "local-deterministic", endpoint = ""): AiActionResult {
  const content = [
    "## AI 执行包",
    "",
    "当前运行没有使用外部模型结果，系统已生成可复核的本地执行稿。",
    "",
    input.userPrompt
  ].join("\n");
  return {
    apiUsed: false,
    model,
    endpoint,
    content,
    responseId: "",
    usage: {
      inputChars: input.systemPrompt.length + input.userPrompt.length,
      outputChars: content.length
    },
    error
  };
}
