import { ChromeEngine } from "../Chrome/Utils";

export class Config {
  private static ZolveHost =
    process.env.NODE_ENV === "development"
      ? "http://127.0.0.1:3000"
      : "https://zolve-dvbhhwg5cmaeardn.italynorth-01.azurewebsites.net";
  private constructor() {}
  public static getZolveHost() {
    return this.ZolveHost;
  }

  public static async getExtensionConfig() {
    try {
      const extensionConfig = await fetch(`${this.ZolveHost}/config`);
      const response = await extensionConfig.json();
      if (response && extensionConfig.ok) {
        await ChromeEngine.setLocalStorage(
          "GlobalPrompt",
          response.globalPrompt
        );
        return true;
      }
      return null;
    } catch (error) {
      return null;
    }
  }
  public static async getShortcuts(): Promise<string[]> {
    const ToggleSidebarShortcutDefault = "Ctrl+Enter";

    try {
      const ToggleSidebarShortcut = (await ChromeEngine.getLocalStorage(
        "ToggleSidebarShortcut"
      )) as string;
      if (!ToggleSidebarShortcut) {
        await ChromeEngine.setLocalStorage(
          "ToggleSidebarShortcut",
          ToggleSidebarShortcutDefault
        );
        return ToggleSidebarShortcutDefault.split("+");
      }
      return ToggleSidebarShortcut.split("+");
    } catch (error) {
      return ToggleSidebarShortcutDefault.split("+");
    }
  }
}
