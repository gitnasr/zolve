<img src="https://github.com/user-attachments/assets/b69e5f17-1e50-41e5-8771-be6a84daa750" width="48" height="48"/>

# Zolve Extension 

### A Chrome extension that uses AI to solve online exams, currently supporting Microsoft Forms with multiple AI backends.


## ✨ Features
- 🤖 **Multiple AI Backends Support** (Claude, Cloudflare Workers AI)
- 📝 **Microsoft Forms Integration**
- 🔄 **Context Menu Integration**
- ⚙️ **Customizable Global Prompts**
- 🎯 **Chunk-based Question Processing**
- 📋 **In-page Answer Display**
- ⌨️ **Keyboard Shortcuts** (`Ctrl+Enter` to show/hide answers)

---

### Basic Usage 🎯
#### On Microsoft Forms:
1. Open any Microsoft Forms exam. ✍️
2. Right-click anywhere on the page. 🖱️
3. Select **Zolver** 🤖
4. Wait for answers to appear in the bottom-right corner. ⏳

#### Controls:
- **Double-click**: Hide answers window 👁️
- **Ctrl+Enter**: Toggle answers window 🔄
- **bottom-right corner hover**: Show answers window ⚙️

## 📥 Installation

### 1️⃣ Use Latest Version
1. Download **Zolve** [latest release](https://github.com/gitnasr/zolve/releases) (Currently tested on Chrome only)
2. Unzip the file.
3. Enable **Developer Mode** in Chrome via `chrome://extensions/`.
4. Drag and drop the folder.
5. Open the options page in the extension to tune your settings!

### 2️⃣ Use the Repository
```bash
# Clone the repo
git clone https://github.com/gitnasr/zolve.git
cd zolve

# Install dependencies
npm install

# Build for production
npm run build

# Development mode with hot reload
npm run watch
```

---

## ⚙️ Configuration

### 🤖 **Claude AI**  
We provide a fully functional reverse API server for the Claude.ai service.  
Simply download the latest release from [here](https://github.com/gitnasr/zolve/tree/claude-engine),  
log in to Claude on Chrome using your account, and the integration will be established automatically.  

- **Server URL 🌐**  
- **Port 🔌**

### ☁️ **Cloudflare Workers AI**
- API Endpoint 🛠️
- Account ID 🆔
- Model Name 🤖
- API Key 🔑

### 🌍 **Global Settings**
- Custom prompts ✍️
- Response formatting 🎭
- Platform-specific settings 📋
---

## 📁 Project Structure

```
src/
├── ai-agents/           # AI Backend Implementations
│   ├── abstract.ts      # Base Agent Class
│   ├── Claude.ts        # Claude AI Implementation
│   └── Cloudflare.ts    # Cloudflare Workers AI Implementation
├── chrome/              # Chrome Extension Utilities
├── components/          # React Components for Options Page
├── engines/             # Exam Platform Implementations
└── Background.ts        # Extension Background Service Worker
```

---

## 🏛 Architecture

### 🔹 AI Agents
All AI agents extend the `Agent` abstract class and implement:
- **`Start()`**: Processes messages and returns responses.
- **`prepareHost()`**: Configures API endpoints and authentication.
- **`SendMessage()`**: Handles API communication.

### 🔹 Exam Engines
Located in `engines/`, each engine implements:
- **Question scraping** 📖
- **Answer formatting** 🖊️
- **Platform-specific logic** ⚙️

---

## 🚀 Adding New Features

### ➕ New AI Backend
1. Create a new agent in `ai-agents/`
2. Extend `Agent` class
3. Implement required methods
4. Add configuration component in `components/`
5. Register in `Background.ts`

#### Example:
```ts
export class NewAIAgent extends Agent {
  protected host: string = "";
  protected readonly ConfigId: string = "NewAIConfig";

  public async Start(message: Message): Promise<string[]> {
    await this.prepareHost();
    const response = await this.SendMessage(message);
    return response.split("\n");
  }

  protected async prepareHost(): Promise<void> {
    const config = await this.getConfigByKey(this.ConfigId);
    this.host = config.apiEndpoint;
  }
}
```

### ➕ New Exam Platform
1. Create a new engine in `engines/`
2. Implement scraping logic
3. Add to `ContentScript.tsx`

#### Example:
```ts
export class NewPlatformScraper {
  public async Scrape(): Promise<string[][]> {
    const questions = // Scraping logic
    return Helper.SplitArrayIntoChunks(questions, 5);
  }
}
```

### 🎨 New UI Feature
1. Add a new component in `components/`
2. Update `options.tsx` if needed
3. Add styles in `index.css`



---

## 🛠️ Build System
- **Webpack** for bundling 🏗️
- **PostCSS/Tailwind** for styling 🎨
- **TypeScript compilation** 📜
- **Asset management** 📦
- **Environment-specific builds** (dev/prod) 🚀

---

## 🤝 Contributing

1. **Fork** the repository 🍴
2. **Create a feature branch** (`git checkout -b feature-name`) 🌿
3. **Commit changes** (`git commit -m "Add new feature"`) 📌
4. **Push to branch** (`git push origin feature-name`) 🚀
5. **Create a Pull Request** 🔄

---

Made with ❤️ by [Nasr](https://github.com/gitnasr) 🚀
