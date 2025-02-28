import {
  ClaudeConfig,
  ClaudeLocalStorage,
  ClaudeServerResponse,
  Message,
} from "../types";

import { Agent } from "./abstract";
import { ChromeEngine } from "../Chrome/Utils";

export class ClaudeReversed extends Agent {
  private static instance: ClaudeReversed;
  protected host: string = "";
  private readonly conversationIdKey: string =
    "ClaudeReversedConversationIdWithForm";
  protected readonly ConfigId: string = "ClaudeConfig";
  private formId: string;
  public conversationId: string | null = null;

  static async getInstance(formId: string) {
    try {
      if (!this.instance) {
        this.instance = new ClaudeReversed(formId);
        const cookies = await ChromeEngine.getCookiesByDomain("claude.ai");
        this.instance.headers.Cookies = cookies;
        await this.instance.PrepareConversation();
      }

      return this.instance;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      ChromeEngine.sendNotification("Claude Error", errorMessage);
      throw error;
    }
  }
  private constructor(formId: string) {
    super();
    this.formId = formId;
  }
  protected async PrepareConfig() {
    const Config = await this.getConfigByKey<ClaudeConfig>(this.ConfigId);
    if (!Config) {
      throw new Error("Claude Config not found");
    }
    this.host = `${Config.serverURL}:${Config.port}`;
  }
  public async Start(message: Message) {
    try {
      await this.PrepareConfig();

      const json = await this.SendMessage<ClaudeServerResponse>(
        message,
        this.conversationId,
        "/claude",
        {
          conversationId: this.conversationId,
        }
      );

      if (json.response == "Too many requests") {
        ChromeEngine.sendNotification(
          "Failed",
          "Claude is limited, try again later"
        );
        return [];
      }
      const SplittedOutput = json.response
        .split(", ")
        .filter(Boolean)
        .map((str) => str.trim());

      return SplittedOutput;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      ChromeEngine.sendNotification("Claude Error", errorMessage);
      throw error;
    }
  }
  private async StartConversation(): Promise<string> {
    await this.getGlobalPrompt();
    const payload = {
      message: this.globalPrompt,
    };
    const Response = await fetch(`${this.host}/claude/new_chat`, {
      body: JSON.stringify(payload),
      headers: this.headers,
      method: "POST",
    });
    if (Response.status == 200) {
      const json = await Response.json();
      return json.conversationId;
    } else {
      throw new Error("Failed to start conversation");
    }
  }

  private async PrepareConversation() {
    await this.PrepareConfig();
    const conversationIdWithForm =
      await ChromeEngine.getLocalStorage<ClaudeLocalStorage>(
        this.conversationIdKey
      );

    if (conversationIdWithForm) {
      this.conversationId = conversationIdWithForm.conversationId;

      let formId = conversationIdWithForm.formId;

      if (formId !== this.formId) {
        this.conversationId = await this.StartConversation();
        await ChromeEngine.setLocalStorage<ClaudeLocalStorage>(
          this.conversationIdKey,
          {
            conversationId: this.conversationId,
            formId: this.formId,
          }
        );
      }
    } else {
      this.conversationId = await this.StartConversation();
      await ChromeEngine.setLocalStorage<ClaudeLocalStorage>(
        this.conversationIdKey,
        {
          conversationId: this.conversationId,
          formId: this.formId,
        }
      );
    }

    if (!this.conversationId) {
      throw new Error("Failed to initialize conversation ID");
    }
  }
}
