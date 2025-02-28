import { CloudflareConfig, CloudflareResponse, Message } from "../types";

import { ChromeEngine } from "../Chrome/Utils";
import { Agent } from "./abstract";

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

      let SplittedOutput = CloudflareResponse.result.response
        .split("</think>")[1]
        .trim()
        .split(",")
        .filter(Boolean);

      return SplittedOutput;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (process.env.NODE_ENV === "development") {
        ChromeEngine.sendNotification("Cloudflare Error", errorMessage);
      } else {
        ChromeEngine.sendNotification(
          "Cloudflare Error",
          "Don't panic! we will retry in a moment."
        );
      }

      this.Start(message);
      throw new Error(errorMessage);
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
