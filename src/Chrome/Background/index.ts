import { Actions } from "../Utils/actions";
import { ChromeEngine } from "../Utils";
import { ChromeMessage } from "../../types";
import { ClaudeReversed } from "../../ai-agents/Claude";
import { Cloudflare } from "../../ai-agents/Cloudflare";
import { ContextMenu } from "../Utils/ContextMenus";

class ChromeBackgroundEngine {
  constructor() {
    this.createContextMenu();
    this.registerContextMenuListener();
    this.registerMessageListener();
  }
  private createContextMenu() {
    new ContextMenu();
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

  private registerMessageListener() {
    chrome.runtime.onMessage.addListener(
      async (message: ChromeMessage, _sender, _response) => {
        const { command, data } = message;

        let DataToBeSetIntoTextBox: string[] = [];
        if (command === Actions.claude) {
          const Agent = await ClaudeReversed.getInstance(data.formId);
          // Retry logic to ensure the conversationId is fetched properly before proceeding
          // The code will try to retrieve the conversationId up to a maximum number of retries (maxRetries).
          // If the conversationId is not available, it will retry after a delay (retryDelay) until the maxRetries is reached.
          // If the conversationId is not fetched after the maximum retries, the function will log a failure message and stop.
          // The delay between retries helps avoid flooding the server with requests in a short time.
          const maxRetries = 5;
          const retryDelay = 2000;
          let retries = 0;
          let conversationIdReady = false;

          while (retries < maxRetries && !conversationIdReady) {
            if (Agent.conversationId) {
              conversationIdReady = true;
            } else {
              retries++;
              console.log(
                `Retry ${retries}/${maxRetries}... waiting for conversationId`
              );
              await ChromeEngine.Sleep(retryDelay);
            }
          }

          if (!conversationIdReady) {
            console.log("Failed to get conversationId after retries");
            return;
          }
          DataToBeSetIntoTextBox = await Agent.Start(data.message);
        }
        if (command === Actions.dsr1) {
          const Agent = new Cloudflare();
          DataToBeSetIntoTextBox = await Agent.Start(data.message);
        }
        const tabId = await ChromeEngine.getTabIdByURL(data.service);
        if (tabId) {
          this.sendMessageToTab(tabId, {
            command: Actions.setResponseIntoTextbox,
            data: DataToBeSetIntoTextBox,
          });
        }
      }
    );
  }

  private sendMessageToTab(tabId: number, message: ChromeMessage) {
    chrome.tabs.sendMessage(tabId, message);
  }
}

new ChromeBackgroundEngine();
