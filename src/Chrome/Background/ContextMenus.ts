import { Actions } from "../Utils/actions";
import { ChromeMessage } from "../../types";

export class ContextMenu {
  private readonly ENV = process.env.NODE_ENV;
  private readonly SupportedWebsites: string[] = ["forms.office.com"];
  private readonly ContextMenus = [
    { id: "zca", title: "ZolveAI" },
    { id: "claude", title: "Claude (Unstable)" },
    { id: "dsr1", title: "Deepseek" },
  ];
  constructor() {
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
    // Delete all context menus, avoid duplication error.
    chrome.contextMenus.removeAll();
    this.ContextMenus.forEach((contextMenu) => {
      chrome.contextMenus.create({
        documentUrlPatterns: this.SupportedWebsites.map(
          (website: string) => `*://${website}/*`
        ),
        title: contextMenu.title,
        contexts: ["page"],
        id: contextMenu.id,
      });
    });

    if (this.ENV === "development") {
      chrome.contextMenus.create({
        documentUrlPatterns: this.SupportedWebsites.map(
          (website: string) => `*://${website}/*`
        ),
        title: "Development Tools",
        contexts: ["all"],
        id: "dev-tools",
      });
      chrome.contextMenus.create({
        documentUrlPatterns: this.SupportedWebsites.map(
          (website: string) => `*://${website}/*`
        ),

        title: "Get Questions as Text",
        contexts: ["all"],
        id: "qast",
        parentId: "dev-tools",
      });
    }
  }
}
