import "../../../public/index.css";

import { Config } from "../../ai-agents/Config";
import { MicrosoftFormsScrapper } from "../../Scrappers/Microsoft/Forms";
import { ChromeMessage } from "../../types";
import { ChromeEngine } from "../Utils";
import { Actions } from "../Utils/actions";

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
            ChromeEngine.sendNotification(
              "Error While Scraping",
              "No Data Sent back from the scraper"
            );
          }
        }
        if (
          command === Actions.setResponseIntoTextbox &&
          window.location.href.includes(this.currentService)
        ) {
          const textBox = await this.renderTextbox();
          textBox.innerHTML += " \n" + data;
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

  private async renderTextbox() {
    const pressedKeys = new Set();

    const Keys = await Config.getShortcuts();
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
      document.addEventListener("keydown", (e) => {
        pressedKeys.add(e.key.toLowerCase());
      });
      document.addEventListener("keyup", (e) => {
        const pressedArray = Array.from(pressedKeys).sort();
        const shortcutArray = Keys.sort();

        if (JSON.stringify(pressedArray) === JSON.stringify(shortcutArray)) {
          parent.style.display =
            parent.style.display === "none" ? "block" : "none";
        }

        pressedKeys.clear();
      });

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
