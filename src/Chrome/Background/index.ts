import { ClaudeReversed } from "../../ai-agents/Claude";
import { Cloudflare } from "../../ai-agents/Cloudflare";
import { Config } from "../../ai-agents/Config";
import { ZolveAgent } from "../../ai-agents/Zolve";
import { ChromeMessage } from "../../types";
import { ChromeEngine } from "../Utils";
import { Actions } from "../Utils/actions";
import { ContextMenu } from "./ContextMenus";

class ChromeBackgroundEngine {
  constructor() {
    this.createContextMenu();
    this.registerMessageListener();
    this.registerInstalledListener();
    this.registerStartupListener();
  }
  private createContextMenu() {
    new ContextMenu();
  }

  private registerStartupListener() {
    chrome.runtime.onStartup.addListener(() => {
      Config.getExtensionConfig().then((config) => {
        if (config) {
          console.log("Extension Config Loaded", config);
        } else {
          ChromeEngine.sendNotification(
            "Error",
            "Failed to load extension config"
          );
        }
      });
    });
  }
  private registerInstalledListener() {
    chrome.runtime.onInstalled.addListener(() => {
      console.log("Chrome Extension Installed");
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
        if (command === Actions.zca) {
          const Agent = new ZolveAgent();
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
