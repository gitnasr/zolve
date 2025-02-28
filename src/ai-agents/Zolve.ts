import { Message, ZolveAgentResponse } from "../types";

import { Agent } from "./abstract";
import { ChromeEngine } from "../Chrome/Utils";
import { Config } from "./Config";

export class ZolveAgent extends Agent {
  protected host: string = Config.getZolveHost();
  protected ConfigId: string = "ZolveAgent";
  async Start(message: Message): Promise<string[]> {
    try {
      const data = await this.SendMessage<ZolveAgentResponse>(
        message,
        "RandomConversationID",
        "/process",
        {}
      );
      const SplittedOutput = data.response.split(",");
      return SplittedOutput;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      ChromeEngine.sendNotification("Zolve Error", errorMessage);
      throw error;
    }
  }
}
