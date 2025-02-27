import { CloudflareConfig, CloudflareResponse, Message } from "../types";

import { Agent } from "./abstract";
import { ChromeEngine } from "../Chrome/Utils";

export class Cloudflare extends Agent {
  protected host: string = "";

  protected readonly ConfigId: string = "CloudflareConfig";

  constructor() {
    super();
  }

  public async Start(message: Message): Promise<string[]> {
    try {
      await this.PrepareConfig();
      const CloudflareResponse = await this.SendMessage<CloudflareResponse>(
        message,
        null,
        null,
        {
          max_tokens: 1024,
        }
      );

      const SplittedOutput = CloudflareResponse.result.response
        .split("</think>")[0]
        .split("\n")
        .filter(Boolean)
        .map((str) => str.trim());

      return SplittedOutput;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      ChromeEngine.sendNotification("Cloudflare Error", errorMessage);
      throw error;
    }
  }

  protected async PrepareConfig(): Promise<void> {
    const Config = await this.getConfigByKey<CloudflareConfig>(this.ConfigId);
    if (!Config) {
      throw new Error("Cloudflare Config not found");
    }
    this.host = `${Config.apiEndpoint}/client/v4/accounts/${Config.accountId}/ai/run/${Config.modelName}`;
    this.headers.Authorization = `Bearer ${Config.apiKey}`;
    await this.getGlobalPrompt();
  }
}
