import "../public/index.css";

import { Actions } from "./chrome/actions";
import { ChromeEngine } from "./chrome";
import { ChromeMessage } from "./types";
import { MicrosoftFormsScrapper } from "./engines/microsoft/forms";

class ContentScript {
  private currentService: string;
  constructor() {
    this.registerListeners();
    this.currentService = "";

  }

  private registerListeners() {
    chrome.runtime.onMessage.addListener(
      async (msg: ChromeMessage, _sender, _sendResponse) => {
        const { command, data } = msg;

        if (command === Actions.start && data.service == "forms.office.com") {
          this.currentService = data.service;
          const MSFS = new MicrosoftFormsScrapper();
          const ArrayOf5Formatted = await MSFS.Scrape();
          if (ArrayOf5Formatted) {
            this.SendChunksToAgent(
              ArrayOf5Formatted,
              data.agent,
              data.service,
              MSFS.formId
            );
          } else {
            ChromeEngine.sendNotification("Error While Scraping", "No Data Sent back from the scraper");
          }
        }
        if (command === Actions.setResponseIntoTextbox && window.location.href.includes(this.currentService)) {
          const textBox = this.renderTextbox();
          textBox.innerHTML += " \n " + data;
        }
      }
    );
  }
  private SendChunksToAgent(
    ArrayOfArrayOfQuestions: string[][],
    agent: keyof typeof Actions,
    service: string,
    formId: string
  ) {
    for (let index = 0; index < ArrayOfArrayOfQuestions.length; index++) {
      const element = ArrayOfArrayOfQuestions[index];
      const Message = element.join("\n");
      chrome.runtime.sendMessage({
        command: Actions[agent],
        data: {
          service,
          message: Message,
          agent,
          formId,
        },
      });
    }
  }

  private renderTextbox() {
    const parent = document.querySelector<HTMLDivElement>(".es-output-parent");

    if (!parent) {

      const textbox = document.createElement("textarea");
      textbox.classList.add("es-output-text-area");
      const parent = document.createElement("div");
      parent.classList.add("es-output-parent");
      parent.appendChild(textbox);
      document.body.appendChild(parent);
      parent.addEventListener("dblclick", () => {
        parent.style.display = "none";
      });
      document.addEventListener("keyup", (e) => {
        if (e.ctrlKey && e.key === "Enter") {
          parent.style.display = "block";
        }
      })

      const clearButton = document.createElement("button");
      clearButton.innerHTML = "Clear";
      clearButton.classList.add("es-clear-button");
      clearButton.addEventListener("click", () => {
        textbox.value = "";
      });
      parent.appendChild(clearButton);

      return textbox;
    }

    const textbox = parent.querySelector(".es-output-text-area")!;

    return textbox;

  }
}

new ContentScript();
