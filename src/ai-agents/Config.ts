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

  public static async getExtensionConfig(): Promise<true | null> {
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
}
