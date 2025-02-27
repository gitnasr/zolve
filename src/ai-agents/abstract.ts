import { ChromeEngine } from "../Chrome/Utils";
import { Message } from "../types";
import { Prompt } from "./Prompt";

export abstract class Agent {
  protected globalPrompt: string = "";
  protected abstract readonly host: string;
  protected abstract ConfigId: string;
  protected readonly headers = {
    "Content-Type": "application/json",
    Authorization: "",
    Cookies: "",
  };
  abstract Start(message: Message): Promise<string[]>;
  async SendMessage<T>(
    message: Message,
    conversationId: string | null = null,
    endpoint: string | null = null,
    extendedBody = {}
  ): Promise<T> {
    const payload = Prompt(
      Array.isArray(message) ? message : [message],
      conversationId ? null : this.globalPrompt
    );
    const url = `${this.host}${endpoint ? endpoint : ""}`;
    const Response = await fetch(url, {
      body: JSON.stringify({ ...payload, ...extendedBody }),
      headers: this.headers,
      method: "POST",
      credentials: "include",
    });

    const json = await Response.json();
    return json;
  }
  async getConfigByKey<T>(key: string): Promise<T | null> {
    const config = await ChromeEngine.getLocalStorage<T>(key);
    return config;
  }
  async getGlobalPrompt(): Promise<void> {
    const prompt = await ChromeEngine.getLocalStorage<string>("GlobalPrompt");
    if (prompt) {
      this.globalPrompt = prompt;
    }
  }
  protected PrepareConfig(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
