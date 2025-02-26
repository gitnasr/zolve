import { Message } from "../types";
import { Agent } from "./abstract";

interface ZolveAgentResponse {
  response: string;
}
export class ZolveAgent extends Agent {
  protected host: string = "http://127.0.0.1:3000/process";
  protected ConfigId: string = "ZolveAgent";
  async Start(message: Message): Promise<string[]> {
    await this.prepareHost();
    const data = await this.SendMessage<ZolveAgentResponse>(
      message,
      "RandomConversationID",
      null,
      {}
    );
    const SplittedOutput = data.response.split(",");
    return SplittedOutput;
  }
  protected async prepareHost(): Promise<void> {
    await this.getGlobalPrompt();
  }
}
