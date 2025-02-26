import { ChromeMessage } from "../../types";
import { Actions } from "../Utils/actions";

export class ContextMenu {
  private readonly ENV = process.env.NODE_ENV;

  constructor() {
    console.log("🚀 ~ ContextMenu ~ ENV:", this.ENV);

    this.createContextMenu();
    this.registerContextMenuListener();
    if (this.ENV === "development") {
      this.registerDevelopmentContextMenu();
    }
  }

  private registerDevelopmentContextMenu() {
    chrome.contextMenus.onClicked.addListener((info, tab) => {
      if (info.menuItemId === "qast" && tab && tab.id) {
        chrome.tabs.sendMessage<ChromeMessage>(tab.id, {
          command: Actions.getQuestionPayload,
          data: {},
        });
      }
    });
  }

  private registerContextMenuListener() {
    chrome.contextMenus.onClicked.addListener((info, tab) => {
      if (tab && tab.id) {
        chrome.tabs.sendMessage<ChromeMessage>(tab.id, {
          command: Actions.start,
          data: {
            agent: info.menuItemId,
            service: new URL(tab.url || "").hostname,
          },
        });
      }
    });
  }

  private createContextMenu() {
    chrome.contextMenus.create({
      title: "Gemini",
      contexts: ["all"],
      id: "google",
    });
    chrome.contextMenus.create({
      title: "Claude",
      contexts: ["all"],
      id: "claude",
    });

    chrome.contextMenus.create({
      title: "Deepseek",
      contexts: ["all"],
      id: "dsr1",
    });

    if (this.ENV === "development") {
      chrome.contextMenus.create({
        title: "Get Questions as Text",
        contexts: ["all"],
        id: "qast",
      });
    }
  }
}
