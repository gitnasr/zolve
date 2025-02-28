export type Message = string | string[];

export interface CloudflareResponse {
  result: Result;
  success: boolean;
  errors: any[];
  messages: any[];
}

export interface Result {
  response: string;
  usage: Usage;
}

export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface PromptMessage {
  role: "system" | "user";
  content: string;
}
export interface IPrompt {
  messages: PromptMessage[];
}

export interface ChromeMessage {
  command: string;
  data: any | null;
}

export interface IQuestions {
  question: string;
  options: Array<string>;
  isMultipleChoice: boolean;
  number: number;
}
export type QuestionWithOptions = IQuestions[];

export interface ClaudeLocalStorage {
  conversationId: string;
  formId: string;
}
export interface ClaudeServerResponse {
  response: string;
}
export interface ClaudeConfig {
  serverURL: string;
  port: number;
}

export interface CloudflareConfig {
  apiEndpoint: string;
  accountId: string;
  modelName: string;
  apiKey: string;
}

export interface ZolveAgentResponse {
  response: string;
}
