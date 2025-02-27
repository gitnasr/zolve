import { Agent } from "./abstract";
import { Message } from "../types";

interface ZolveAgentResponse {
  response: string;
}
export class ZolveAgent extends Agent {
  protected host: string = "http://127.0.0.1:3000";
  protected ConfigId: string = "ZolveAgent";
  async Start(message: Message): Promise<string[]> {
    await this.PrepareConfig();
    const data = await this.SendMessage<ZolveAgentResponse>(
      message,
      "RandomConversationID",
      "/process",
      {}
    );
    const SplittedOutput = data.response.split(",");
    return SplittedOutput;
  }
}
