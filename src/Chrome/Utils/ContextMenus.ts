export class ContextMenu {
  private readonly ENV = process.env.NODE_ENV;

  constructor() {
    this.createContextMenu();
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
