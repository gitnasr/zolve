import { CloudflareConfig, CloudflareResponse, Message } from "../types";

import { Agent } from "./abstract";
import { ChromeEngine } from "../Chrome/Utils";

export class Cloudflare extends Agent {
  protected host: string = "";
  private MAX_retries = 3;

  protected readonly ConfigId: string = "CloudflareConfig";

  constructor() {
    super();
  }

  public async Start(
    message: Message,
    RetryCount: number = 0
  ): Promise<string[]> {
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

      let SplittedOutput = CloudflareResponse.result.response
        .split("</think>")[1]
        .trim()
        .split(",")
        .filter(Boolean);

      return SplittedOutput;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      if (errorMessage == "400") {
        ChromeEngine.sendNotification(
          "Cloudflare Error",
          "Please configure Cloudflare AI Agent first."
        );
        return [];
      }
      ChromeEngine.sendNotification(
        "Cloudflare Error",
        "Don't panic! we will retry in a moment."
      );

      if (RetryCount < this.MAX_retries) {
        return await this.Start(message, RetryCount + 1);
      } else {
        throw new Error(errorMessage);
      }
    }
  }

  protected async PrepareConfig(): Promise<void> {
    const Config = await this.getConfigByKey<CloudflareConfig>(this.ConfigId);
    if (!Config) {
      throw new Error("400");
    }
    this.host = `${Config.apiEndpoint}/client/v4/accounts/${Config.accountId}/ai/run/${Config.modelName}`;
    this.headers.Authorization = `Bearer ${Config.apiKey}`;
    await this.getGlobalPrompt();
  }
}
