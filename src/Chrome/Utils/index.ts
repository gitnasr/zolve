export class ChromeEngine {
  private constructor() {}
  static sendNotification(title: string, message: string) {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "../assets/icon.png",
      title,
      message,
    });
  }
  static getCookiesByDomain(domain: string): Promise<string> {
    return new Promise((resolve, reject) => {
      chrome.cookies.getAll({ domain }, (cookies) => {
        const cookieString = cookies
          .map((cookie) => `${cookie.name}=${cookie.value}`)
          .join("; ");
        resolve(cookieString);
      });
    });
  }
  static getLocalStorage<T>(key: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(key, (result) => {
        if (result[key]) resolve(result[key]);
        else resolve(null);
      });
    });
  }
  static setLocalStorage<T>(key: string, value: T): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set({ [key]: value }, () => {
        resolve();
      });
    });
  }

  static async clearStorage() {
    chrome.storage.sync.clear();
  }
  static async getTabIdByURL(url: string): Promise<number | null> {
    return new Promise((resolve, reject) => {
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        (tabs) => {
          const tab = tabs.find((tab) => tab.url?.includes(url));
          if (tab && tab.id) resolve(tab.id);
          else resolve(null);
        }
      );
    });
  }
  static async Sleep(milliseconds: number) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }
}
