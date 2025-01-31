import { Actions } from "./chrome/actions";
import { ChromeEngine } from "./chrome";
import { ChromeMessage } from "./types";
import { MicrosoftFormsScrapper } from "./engines/microsoft/forms";
import { clipboard } from "@extend-chrome/clipboard";

class ContentScript {
  constructor() {
    this.registerListeners();
  }

  private registerListeners() {
    chrome.runtime.onMessage.addListener(async (msg: ChromeMessage, _sender, _sendResponse) => {
      const { command, data } = msg;

      if (command === Actions.start && data.service == "forms.office.com") {
        const MSFS = new MicrosoftFormsScrapper();
        const ArrayOf5Formatted = await MSFS.Scrape();
        if (ArrayOf5Formatted) {
          this.SendChunksToAgent(ArrayOf5Formatted, data.agent, data.service, MSFS.formId)
        } else {
          console.log("🚀 ~ ContentScript ~ No questions found")
        }

      }
      if (command === Actions.setClipboard) {
        for (const line of data) {
          await clipboard.writeText(line);
          await ChromeEngine.Sleep(2000);
        }
      }

    });
  }
  private SendChunksToAgent(ArrayOfArrayOfQuestions: string[][], agent: keyof typeof Actions, service: string, formId: string) {
    for (let index = 0; index < ArrayOfArrayOfQuestions.length; index++) {
      const element = ArrayOfArrayOfQuestions[index];
      const Message = element.join("\n")
      chrome.runtime.sendMessage({
        command: Actions[agent],
        data: {
          service,
          message: Message,
          agent,
          formId
        }
      })
    }
  }


}

new ContentScript();